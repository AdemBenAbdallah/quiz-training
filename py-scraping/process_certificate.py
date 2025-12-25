#!/usr/bin/env python3
"""
Generic Certificate Question Processor
Processes raw scraped questions for any certificate with configurable distribution
"""

import json
import os
import shutil
import sys
from datetime import datetime
from typing import Dict, List, Tuple


class CertificateConfig:
    """Configuration for certificate question distribution"""

    def __init__(self,
                 certificate_id: str,
                 questions_per_level: int = 65,
                 min_questions_last_level: int = 10,
                 max_levels: int = 10):
        self.certificate_id = certificate_id
        self.questions_per_level = questions_per_level
        self.min_questions_last_level = min_questions_last_level
        self.max_levels = max_levels

class SmartQuestionProcessor:
    """Smart question processor with configurable distribution and edge case handling"""

    def __init__(self, config: CertificateConfig):
        self.config = config
        self.questions = []
        self.signatures = set()

    def load_raw_questions(self, input_file: str = None) -> bool:
        """Load questions from raw JSON file"""
        if not input_file:
            # Default path based on certificate
            input_file = f"../public/quiz/{self.config.certificate_id.lower()}/raw/questions.json"

        if not os.path.exists(input_file):
            print(f"Error loading raw questions file: {input_file}")
            return False

        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                self.questions = json.load(f)
            print(f"Loaded {len(self.questions)} raw questions")
            return True
        except Exception as e:
            print(f"Error loading raw questions: {e}")
            return False

    def generate_question_signature(self, question: Dict) -> str:
        """Generate unique signature for question deduplication"""
        # Use first 100 chars of question text + first 50 chars of first 3 choices
        question_text = question.get('question', '')[:100].lower().replace(' ', '')
        choices_text = ''
        for choice in question.get('choices', [])[:3]:
            choices_text += choice[:50].lower().replace(' ', '')

        return question_text + choices_text

    def remove_duplicates(self) -> int:
        """Remove duplicate questions based on content"""
        unique_questions = []
        duplicates_count = 0

        for question in self.questions:
            signature = self.generate_question_signature(question)

            if signature not in self.signatures:
                self.signatures.add(signature)
                unique_questions.append(question)
            else:
                duplicates_count += 1
                print(f"Removed duplicate: {question.get('question_number', 'Unknown')}")

        self.questions = unique_questions
        print(f"Removed {duplicates_count} duplicates, {len(self.questions)} unique questions remain")
        return duplicates_count

    def validate_questions(self) -> int:
        """Validate question data quality"""
        valid_questions = []
        invalid_count = 0

        for question in self.questions:
            # Check required fields
            if not question.get('question', '').strip():
                invalid_count += 1
                print(f"Invalid question - missing text: {question.get('question_number', 'Unknown')}")
                continue

            if len(question.get('choices', [])) < 4:
                invalid_count += 1
                print(f"Invalid question - insufficient choices: {question.get('question_number', 'Unknown')}")
                continue

            if not question.get('answers', []):
                invalid_count += 1
                print(f"Invalid question - missing answer: {question.get('question_number', 'Unknown')}")
                continue

            valid_questions.append(question)

        self.questions = valid_questions
        print(f"Validated questions, {invalid_count} invalid questions removed")
        return invalid_count

    def smart_distribute_questions(self) -> Tuple[List[int], Dict[int, List[Dict]]]:
        """
        Smart distribution with edge case handling

        Returns:
            Tuple of (level_sizes, levels_data)
        """
        total_questions = len(self.questions)
        qpl = self.config.questions_per_level
        min_last = self.config.min_questions_last_level

        print(f"Total questions: {total_questions}")
        print(f"Questions per level: {qpl}")
        print(f"Min questions for last level: {min_last}")

        # Handle edge cases
        if total_questions <= qpl:
            # Single level for small question sets
            level_sizes = [total_questions]
            print(f"Single level: {total_questions} questions")
        else:
            # Calculate base distribution
            base_levels = total_questions // qpl
            remainder = total_questions % qpl

            # Apply max levels constraint
            if base_levels > self.config.max_levels:
                qpl = total_questions // self.config.max_levels
                base_levels = self.config.max_levels
                remainder = total_questions % self.config.max_levels
                print(f"Adjusted for max levels: {self.config.max_levels} levels of ~{qpl} questions")

            # Smart remainder handling
            if remainder == 0:
                # Perfect division
                level_sizes = [qpl] * base_levels
                print(f"Perfect division: {base_levels} levels of {qpl} questions")
            elif remainder < min_last and base_levels > 0:
                # Merge small remainder with last level
                level_sizes = [qpl] * (base_levels - 1) + [qpl + remainder]
                print(f"Merged remainder: {base_levels - 1} levels of {qpl} + 1 level of {qpl + remainder}")
            else:
                # Create separate level for remainder
                level_sizes = [qpl] * base_levels + [remainder]
                print(f"Separate remainder: {base_levels} levels of {qpl} + 1 level of {remainder}")

        # Create levels data
        levels_data = {}
        current_question = 0

        for level_num, level_size in enumerate(level_sizes, 1):
            level_questions = self.questions[current_question:current_question + level_size]
            levels_data[level_num] = level_questions
            print(f"Level {level_num}: {len(level_questions)} questions")
            current_question += level_size

        return level_sizes, levels_data

    def backup_existing_files(self):
        """Skip backup creation - raw questions serve as master backup"""
        print("Skipping backup creation - raw questions serve as master backup")

    def save_levels(self, levels_data: Dict[int, List[Dict]]):
        """Save questions to level files"""
        output_dir = f"../public/quiz/{self.config.certificate_id.lower()}"
        os.makedirs(output_dir, exist_ok=True)

        for level_num, questions in levels_data.items():
            level_file = os.path.join(output_dir, f'level{level_num}.json')

            try:
                with open(level_file, 'w', encoding='utf-8') as f:
                    json.dump(questions, f, indent=2, ensure_ascii=False)
                print(f"Saved {len(questions)} questions to level {level_num}")
            except Exception as e:
                print(f"Error saving level {level_num}: {e}")

    def create_metadata(self, level_sizes: List[int]):
        """Create metadata.json for the certificate"""
        output_dir = f"../public/quiz/{self.config.certificate_id.lower()}"
        metadata_file = os.path.join(output_dir, "metadata.json")

        # Certificate-specific metadata
        certificate_info = {
            "ansc01": {
                "name": "AWS Certified Advanced Networking - Specialty",
                "description": "ANS-C01 certification exam preparation",
                "heroTitle": "Master AWS Advanced Networking",
                "heroDescription": "Prepare for the AWS Certified Advanced Networking - Specialty exam with comprehensive practice questions",
                "badgeColor": "bg-blue-500"
            },
            "aws-developer": {
                "name": "AWS Certified Developer Associate",
                "description": "DVA-C02 certification exam preparation",
                "heroTitle": "Master AWS Development",
                "heroDescription": "Prepare for the AWS Certified Developer Associate exam",
                "badgeColor": "bg-orange-500"
            }
        }.get(self.config.certificate_id.lower(), {
            "name": self.config.certificate_id,
            "description": f"{self.config.certificate_id} certification preparation",
            "heroTitle": f"Master {self.config.certificate_id}",
            "heroDescription": f"Prepare for the {self.config.certificate_id} certification exam",
            "badgeColor": "bg-gray-500"
        })

        metadata = {
            "slug": self.config.certificate_id.lower(),
            "name": certificate_info["name"],
            "description": certificate_info["description"],
            "totalLevels": len(level_sizes),
            "questionsPerLevel": level_sizes,
            "levels": {},
            "heroTitle": certificate_info["heroTitle"],
            "heroDescription": certificate_info["heroDescription"],
            "badgeColor": certificate_info["badgeColor"],
            "lastUpdated": datetime.now().isoformat()
        }

        # Update level counts
        for level_num, level_size in enumerate(level_sizes, 1):
            metadata["levels"][str(level_num)] = level_size

        try:
            with open(metadata_file, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, ensure_ascii=False)
            print(f"Created metadata: {metadata_file}")
        except Exception as e:
            print(f"Error creating metadata: {e}")

    def process(self) -> bool:
        """Main processing pipeline"""
        print(f"Starting smart question processing for {self.config.certificate_id}...")

        # Load raw questions
        if not self.load_raw_questions():
            return False

        # Remove duplicates
        self.remove_duplicates()

        # Validate questions
        self.validate_questions()

        if not self.questions:
            print("No valid questions to process")
            return False

        # Skip backup - raw questions serve as master backup

        # Distribute questions with smart algorithm
        level_sizes, levels_data = self.smart_distribute_questions()

        # Save level files
        self.save_levels(levels_data)

        # Create metadata
        self.create_metadata(level_sizes)

        print(f"Smart question processing completed successfully!")
        print(f"Created {len(level_sizes)} levels with distribution: {level_sizes}")
        return True

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python process_certificate.py <certificate_id> [questions_per_level] [min_last_level] [max_levels]")
        print("Example: python process_certificate.py ANS-C01 65 10 10")
        sys.exit(1)

    # Parse command line arguments
    certificate_id = sys.argv[1]

    # Optional parameters
    questions_per_level = int(sys.argv[2]) if len(sys.argv) > 2 else 65
    min_questions_last_level = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    max_levels = int(sys.argv[4]) if len(sys.argv) > 4 else 10

    # Create configuration
    config = CertificateConfig(
        certificate_id=certificate_id,
        questions_per_level=questions_per_level,
        min_questions_last_level=min_questions_last_level,
        max_levels=max_levels
    )

    # Process questions
    processor = SmartQuestionProcessor(config)
    processor.process()

if __name__ == "__main__":
    main()
