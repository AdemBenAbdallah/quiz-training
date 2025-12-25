#!/usr/bin/env python3
"""
AWS Quiz Web Scraper with Resume Capability
Scrapes examtopics.com for AWS certification questions
"""

import json
import os
import random
import signal
import sys
import time
from datetime import datetime
from typing import Dict, List, Optional

try:
    import requests
    from bs4 import BeautifulSoup
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.ui import WebDriverWait
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    print("Please install with: pip install requests beautifulsoup4 selenium webdriver-manager")
    sys.exit(1)


# Import configuration
try:
    from config import DEFAULT_CONFIG, get_config_for_exam
    CONFIG = get_config_for_exam("SAA-C03")
    # Add topic and question range for ANS-C01
    CONFIG.update({
        "topic": 1,
        "start_question":1019,
        "end_question": 500
    })
except ImportError:
    # Fallback configuration if config.py is not available
    CONFIG = {
        "current_exam": "SAA-C03",
        "topic": 1,
        "start_question":1019,
        "end_question": 500,
        "delay_range": (2, 5),
        "max_retries": 3,
        "request_timeout": 30,
        "output_dir": "../public/quiz/saac03/raw",
        "levels_config": "../public/quiz/saac03/metadata.json",
        "state_file": "state.json",
        "exam_domain": "examtopics.com",
        "headless": True,
        "browser_timeout": 30
    }


class QuizScraper:
    """Main scraper class with state management"""

    def __init__(self, resume_mode: bool = False):
        self.resume_mode = resume_mode
        self.state = self.load_state()
        self.driver = None
        self.session_start_time = datetime.now()

    def load_state(self) -> Dict:
        """Load previous scraping state"""
        state_file = CONFIG["state_file"]
        if os.path.exists(state_file) and self.resume_mode:
            try:
                with open(state_file, 'r', encoding='utf-8') as f:
                    state = json.load(f)
                    print(f"📂 Loaded existing state from {state_file}")
                    return state
            except (json.JSONDecodeError, FileNotFoundError) as e:
                print(f"⚠️  Warning: Could not load state file: {e}")
                print("🔄 Starting fresh...")

        # Fresh start
        print("🆕 Starting with fresh state")
        return self.get_default_state()

    def get_default_state(self) -> Dict:
        """Get default state for fresh start"""
        total_questions = CONFIG["start_question"] - CONFIG["end_question"] + 1
        return {
            "current_exam": CONFIG["current_exam"],
            "current_topic": CONFIG["topic"],
            "start_question": CONFIG["start_question"],
            "end_question": CONFIG["end_question"],
            "last_processed_question": 0,  # No questions processed yet
            "failed_questions": [],
            "completed_questions": [],
            "scraping_session": {
                "start_time": datetime.now().isoformat(),
                "total_questions": total_questions,
                "questions_remaining": total_questions,
                "status": "running"
            }
        }

    def save_state(self):
        """Save current scraping state"""
        try:
            state_file = CONFIG["state_file"]
            with open(state_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"❌ Error saving state: {e}")

    def setup_driver(self):
        """Setup Chrome WebDriver using regular selenium"""
        try:
            options = Options()
            if CONFIG["headless"]:
                options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--disable-blink-features=AutomationControlled")
            options.add_experimental_option("excludeSwitches", ["enable-automation"])
            options.add_experimental_option('useAutomationExtension', False)

            # Configure for Chromium browser
            options.binary_location = '/usr/bin/chromium'

            # Try to setup ChromeDriver
            try:
                from webdriver_manager.chrome import ChromeDriverManager
                service = Service(ChromeDriverManager().install())
                self.driver = webdriver.Chrome(service=service, options=options)
            except Exception as e:
                print(f"⚠️  ChromeDriverManager failed: {e}")
                # Fallback: try with system ChromeDriver if available
                try:
                    self.driver = webdriver.Chrome(options=options)
                except Exception as e2:
                    print(f"❌ ChromeDriver setup failed: {e2}")
                    return False

            self.driver.set_page_load_timeout(CONFIG["browser_timeout"])
            print("✅ Chrome WebDriver initialized with regular selenium")
            return True
        except Exception as e:
            print(f"❌ Error setting up WebDriver: {e}")
            return False

    def search_question_url(self, question_num: int) -> Optional[str]:
        """Search for question URL using DuckDuckGo"""
        try:
            # Create search query with quotes and site restriction
            query = f'{CONFIG["current_exam"]} question {question_num} site:examtopics.com'
            search_url = f"https://duckduckgo.com/?q={query.replace(' ', '+')}"

            print(f"🔍 Searching DuckDuckGo for: {query}")
            self.driver.get(search_url)
            time.sleep(random.uniform(2, 4))  # Wait for results to load

            # Check for CAPTCHA
            if self.check_and_handle_captcha():
                print("⏸️  CAPTCHA detected and handled, continuing...")
                time.sleep(5)

            # Find and click the FIRST examtopics result
            try:
                # Try multiple selectors for DuckDuckGo results
                first_result_selectors = [
                    'a[data-testid="result-title-a"]',  # New DuckDuckGo
                    '.result__a',                        # Classic DuckDuckGo
                    'article a[href*="examtopics"]',    # Article links
                    'a[href*="examtopics.com"]'         # Any examtopics link
                ]

                first_result = None
                for selector in first_result_selectors:
                    try:
                        first_result = self.driver.find_element(By.CSS_SELECTOR, selector)
                        if first_result:
                            href = first_result.get_attribute("href") or ""
                            if "examtopics.com" in href:
                                print(f"🖱️  Found examtopics result with selector: {selector}")
                                break
                    except:
                        continue

                if first_result:
                    # Click the result
                    first_result.click()
                    print(f"🖱️  Clicked examtopics result")

                    # Wait for navigation
                    time.sleep(random.uniform(2, 3))

                    # Get the final URL
                    current_url = self.driver.current_url
                    print(f"🎯 Navigated to: {current_url}")

                    return current_url
                else:
                    print(f"❌ Could not find examtopics results")
                    return None

            except Exception as e:
                print(f"❌ Error clicking first result: {e}")
                return None

        except Exception as e:
            print(f"❌ Error searching for question {question_num}: {e}")
            return None


    def check_and_handle_captcha(self) -> bool:
        """Check for CAPTCHA and wait for manual solving"""
        try:
            # Common CAPTCHA indicators
            captcha_indicators = [
                'iframe[src*="recaptcha"]',
                'iframe[src*="hcaptcha"]',
                '.g-recaptcha',
                '.h-captcha',
                'div[id*="captcha"]',
                'div[class*="captcha"]'
            ]

            for indicator in captcha_indicators:
                try:
                    captcha_element = self.driver.find_element(By.CSS_SELECTOR, indicator)
                    if captcha_element:
                        print("🚨 CAPTCHA DETECTED!")
                        print("⚠️  Please solve the CAPTCHA manually in the browser window.")
                        print("⏱️  You have 4 minutes to solve it...")
                        print("✅ After solving, press Enter here to continue, or type 'skip' to skip this question")

                        # Wait for user to solve CAPTCHA
                        import select
                        import sys
                        import time

                        start_time = time.time()
                        timeout = 240  # 4 minutes

                        while time.time() - start_time < timeout:
                            # Check if user pressed Enter or typed skip
                            if sys.stdin in select.select([sys.stdin], [], [], 1)[0]:
                                user_input = sys.stdin.readline().strip().lower()
                                if user_input == 'skip':
                                    print("⏭️  Skipping question due to CAPTCHA")
                                    return False
                                else:
                                    print("✅ Continuing after manual CAPTCHA solving")
                                    return True
                            else:
                                remaining = int(timeout - (time.time() - start_time))
                                print(f"⏳ Time remaining: {remaining} seconds...", end='\r')

                                # Check if CAPTCHA is resolved by looking for content
                                try:
                                    # Try to find if the page has loaded content (CAPTCHA solved)
                                    body_text = self.driver.find_element(By.TAG_NAME, 'body').text
                                    if len(body_text) > 100:  # If page has substantial content
                                        print("✅ CAPTCHA appears to be resolved automatically!")
                                        return True
                                except:
                                    pass

                            # Add a small delay to prevent high CPU usage
                            time.sleep(1)

                        print("\n⏰ Time's up! Skipping question...")
                        return False
                except:
                    continue

            # No CAPTCHA detected
            return False

        except Exception as e:
            print(f"⚠️  Error checking for CAPTCHA: {e}")
            return False

    def extract_question_data(self, url: str, question_num: int) -> Optional[Dict]:
        """Extract question data from examtopics page"""
        try:
            print(f"🔍 Scraping question {question_num}: {url}")
            if not self.driver:
                print(f"❌ WebDriver not initialized for question {question_num}")
                return None

            self.driver.get(url)
            time.sleep(random.uniform(2, 4))  # Wait for page load

            # Check for CAPTCHA on examtopics page
            if self.check_and_handle_captcha():
                print("⏸️  CAPTCHA detected on examtopics page, continuing...")
                # Wait a bit more after CAPTCHA
                time.sleep(5)
                # Reload the page
                self.driver.get(url)
                time.sleep(random.uniform(2, 4))

            # DEBUG: Show page title and URL
            page_title = self.driver.title or ""
            current_url = self.driver.current_url
            print(f"📄 Page title: {page_title}")
            print(f"🌐 Current URL: {current_url}")

            # Check if page loaded successfully
            if "404" in page_title or "not found" in page_title.lower():
                print(f"❌ Question {question_num} not found (404)")
                return None

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')

            # DEBUG: Check if this is the right question page
            if f"question-{question_num}" not in current_url.lower():
                print(f"⚠️  WARNING: URL doesn't contain expected question number {question_num}")
                print(f"⚠️  Expected pattern: question-{question_num}")
                print(f"⚠️  Actual URL: {current_url}")

            # Extract question data
            question_data = {
                "url": url,
                "question_number": f"Question #: {question_num}Topic #: {CONFIG['topic']}",
                "question": "",
                "choices": [],
                "answers": []
            }

            # Extract question text
            question_element = soup.find('div', class_='question-body')
            if question_element:
                question_text_element = question_element.find('p', class_='card-text')
                if question_text_element:
                    question_data["question"] = question_text_element.get_text(strip=True).replace('\n', ' ').strip()
                    print(f"📝 Extracted question text: {question_data['question'][:100]}...")
                else:
                    print(f"⚠️  No card-text found in question body")
            else:
                print(f"⚠️  No question-body found")
                # Try alternative selectors
                alt_question = soup.find('div', class_='card-body')
                if alt_question:
                    print(f"✅ Found alternative card-body")
                else:
                    print(f"❌ No question content found at all")

            # Extract choices
            choices_container = soup.find('div', class_='question-choices-container')
            if choices_container:
                choice_items = choices_container.find_all('li', class_='multi-choice-item')
                print(f"📋 Found {len(choice_items)} choice items")
                for i, item in enumerate(choice_items):
                    choice_text = item.get_text(strip=True)
                    print(f"  Choice {i+1}: {choice_text}")
                    # Remove choice letter prefix (e.g., "A. ", "B. ", etc.)
                    import re
                    choice_text = re.sub(r'^[A-D]\.\s*', '', choice_text).strip()
                    if choice_text:
                        question_data["choices"].append(choice_text)
            else:
                print(f"⚠️  No question-choices-container found")
                # Try alternative selectors
                alt_choices = soup.find_all('li', class_='multi-choice-item')
                print(f"📋 Found {len(alt_choices)} alternative choice items")

            # Extract most voted answer
            most_voted_answer = self.extract_most_voted_answer(soup)
            if most_voted_answer:
                question_data["answers"] = [most_voted_answer]

            # Validate extracted data
            if question_data["question"] and len(question_data["choices"]) >= 4:
                return question_data
            else:
                print(f"⚠️  Incomplete data for question {question_num}")
                return None

        except Exception as e:
            print(f"❌ Error extracting question {question_num}: {e}")
            return None

    def extract_most_voted_answer(self, soup) -> Optional[str]:
        """Extract most voted answer from page"""
        # Method 1: Check JSON script
        script_tags = soup.find_all('script', type='application/json')
        for script in script_tags:
            try:
                if 'voted_answers' in script.string:
                    vote_data = json.loads(script.string)
                    if vote_data.get('is_most_voted'):
                        return vote_data.get('voted_answers')
            except:
                pass

        # Method 2: Check CSS classes
        correct_choice = soup.find('li', class_='correct-hidden')
        if correct_choice:
            letter_span = correct_choice.find('span', class_='multi-choice-letter')
            if letter_span:
                return letter_span.text.strip()

        return None

    def scrape_question(self, question_num: int) -> bool:
        """Scrape a single question with retry logic"""
        max_retries = CONFIG["max_retries"]
        delay_range = CONFIG["delay_range"]

        for attempt in range(max_retries):
            try:
                # Search for URL
                url = self.search_question_url(question_num)
                if not url:
                    # No results found - move to next question, don't retry
                    print(f"⚠️  No search results found for question {question_num}, moving to next...")
                    self.state['last_processed_question'] = question_num
                    self.save_state()
                    return False

                # Extract question data
                question_data = self.extract_question_data(url, question_num)
                if question_data:
                    # Save to state
                    self.state['completed_questions'].append(question_num)
                    self.state['last_processed_question'] = question_num
                    if question_num in self.state['failed_questions']:
                        self.state['failed_questions'].remove(question_num)

                    # Save to raw data file
                    self.save_question_to_raw_file(question_data)
                    self.save_state()

                    print(f"✅ Successfully scraped question {question_num}")
                    return True
                else:
                    # Failed to extract data, but this counts as processed
                    print(f"⚠️  Failed to extract data for question {question_num}")
                    self.state['last_processed_question'] = question_num
                    if question_num not in self.state['failed_questions']:
                        self.state['failed_questions'].append(question_num)
                    self.save_state()
                    return False

            except Exception as e:
                print(f"❌ Attempt {attempt + 1} failed for question {question_num}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(random.uniform(*delay_range))

        # Mark as failed if all retries exhausted
        if question_num not in self.state['failed_questions']:
            self.state['failed_questions'].append(question_num)
        self.state['last_processed_question'] = question_num
        self.save_state()
        print(f"❌ Question {question_num} marked as failed after {max_retries} attempts")
        return False

    def save_question_to_raw_file(self, question_data: Dict):
        """Save question to raw JSON file"""
        output_dir = CONFIG["output_dir"]
        os.makedirs(output_dir, exist_ok=True)
        raw_file = os.path.join(output_dir, 'questions.json')

        try:
            # Load existing data
            if os.path.exists(raw_file):
                with open(raw_file, 'r', encoding='utf-8') as f:
                    existing_data = json.load(f)
            else:
                existing_data = []

            # Add new question
            existing_data.append(question_data)

            # Save back to file
            with open(raw_file, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, indent=2, ensure_ascii=False)

        except Exception as e:
            print(f"❌ Error saving question to raw file: {e}")

    def print_progress(self):
        """Print current progress"""
        completed = len(self.state.get('completed_questions', []))
        total = self.state['scraping_session']['total_questions']
        percentage = (completed / total) * 100 if total > 0 else 0

        print(f"\n📈 Progress: {completed}/{total} ({percentage:.1f}%)")
        print(f"🔢 Last scraped: Question {self.state.get('last_processed_question', 'N/A')}")
        print(f"❌ Failed: {len(self.state.get('failed_questions', []))} questions")
        print(f"⏱️  Session time: {datetime.now() - self.session_start_time}")

    def get_next_question(self) -> Optional[int]:
        """Get next question to scrape"""
        last_processed = self.state.get('last_processed_question', 0)

        # If no questions processed yet (last_processed_question is 0), start from start_question
        if last_processed == 0:
            next_q = CONFIG["start_question"]
        else:
            next_q = last_processed - 1

        if next_q < self.state['end_question']:
            print("⚠️  All questions completed!")
            return None

        return next_q

    def run_scraping(self):
        """Main scraping loop"""
        print(f"🚀 Starting {'resume' if self.resume_mode else 'fresh'} scraping for {CONFIG['current_exam']} Topic {CONFIG['topic']}")

        if not self.setup_driver():
            return

        try:
            while True:
                next_question = self.get_next_question()
                if not next_question:
                    break

                # Add random delay between requests
                delay = random.uniform(*CONFIG["delay_range"])
                print(f"⏳ Waiting {delay:.1f}s before next request...")
                time.sleep(delay)

                # Scrape the question
                self.scrape_question(next_question)
                self.print_progress()

        except KeyboardInterrupt:
            print("\n⏸️  Scraping interrupted by user")
        finally:
            if self.driver:
                self.driver.quit()
                print("🔚 WebDriver closed")

    def retry_failed_questions(self):
        """Retry only failed questions"""
        failed = self.state.get('failed_questions', []).copy()
        if not failed:
            print("✅ No failed questions to retry")
            return

        print(f"🔄 Retrying {len(failed)} failed questions: {failed}")

        if not self.setup_driver():
            return

        try:
            for question_num in failed:
                self.scrape_question(question_num)
                self.print_progress()
        finally:
            if self.driver:
                self.driver.quit()


def signal_handler(sig, frame):
    """Handle graceful shutdown"""
    print(f"\n⏸️  Received signal {sig}")
    print("💾 Saving state...")
    if 'scraper' in globals():
        scraper.state['scraping_session']['status'] = 'paused'
        scraper.save_state()
        print("📝 Resume with: python web_scraper.py --resume")
    sys.exit(0)


def main():
    """Main entry point"""
    global scraper

    # Parse command line arguments
    resume_mode = '--resume' in sys.argv
    retry_failed_mode = '--retry-failed' in sys.argv
    reset_mode = '--reset' in sys.argv

    if reset_mode:
        state_file = CONFIG["state_file"]
        if os.path.exists(state_file):
            os.remove(state_file)
            print("🗑️  State reset")
        resume_mode = False

    # Initialize scraper
    scraper = QuizScraper(resume_mode=resume_mode)

    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Choose execution mode
    if retry_failed_mode:
        scraper.retry_failed_questions()
    else:
        # Update session status
        scraper.state['scraping_session']['status'] = 'running'
        scraper.state['scraping_session']['start_time'] = datetime.now().isoformat()
        scraper.save_state()

        # Show current status if resuming
        if resume_mode:
            scraper.print_progress()
            print(f"🔄 Resuming from question {scraper.get_next_question()}")

        # Start scraping
        scraper.run_scraping()

    # Mark session as completed
    scraper.state['scraping_session']['status'] = 'completed'
    scraper.save_state()
    print("✅ Scraping session completed!")


if __name__ == "__main__":
    main()
