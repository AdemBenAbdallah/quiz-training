# Quiz Training - Certificate Management

A streamlined system for adding new certification exams to the quiz training application.

## 🚀 Quick Start - Add New Certificate

### Phase 1: Scrape Questions

```bash
cd py-scraping
uv run python web_scraper.py
```

### Phase 2: Process Questions

```bash
uv run python process_certificate.py CERT-ID [questions_per_level] [min_last_level] [max_levels]
```

### Phase 3: Integrate with Web App

```bash
uv run python integrate_certificate.py CERT-ID
```

## 📋 Complete Example - Add ANS-C01

```bash
# 1. Scrape questions (already done for ANS-C01)
uv run python web_scraper.py

# 2. Process questions
uv run python process_certificate.py ANS-C01 65 10 10

# 3. Integrate with web app
uv run python integrate_certificate.py ANS-C01
```

## 📁 File Structure

```
py-scraping/
├── web_scraper.py              # Extract questions from examtopics.com
├── process_certificate.py      # Generic question processor
├── integrate_certificate.py    # Generic web app integration
├── config.py                   # Certificate configurations
├── requirements.txt            # Dependencies
└── run_scraper.sh             # Helper script for running scraper
```

## ⚙️ Configuration

### Add New Certificate to config.py

```python
"NEW-CERT": {
    "name": "New Certification Name",
    "topics": [1, 2, 3],
    "question_ranges": {
        1: (200, 1),    # Topic 1: questions 200 to 1
        2: (350, 201),  # Topic 2: questions 350 to 201
        3: (500, 351),  # Topic 3: questions 500 to 351
    },
    "total_questions": 500,
    "search_query_template": "{exam} topic {topic} question {question} discussion"
}
```

### Process Questions with Custom Settings

```bash
# AWS Exams (65 questions per level - standard exam length)
uv run python process_certificate.py DVA-C02 65 10 10

# Azure Exams (40 questions per level)
uv run python process_certificate.py AZ-900 40 8 8

# Custom configuration
uv run python process_certificate.py CUSTOM-CERT 50 5 12
```

## 🔄 Smart Distribution Algorithm

The processor uses intelligent distribution:

```python
# Examples:
272 questions ÷ 65 = 4 remainder 12 → 5 levels [65,65,65,65,12]
200 questions ÷ 65 = 3 remainder 5 → 3 levels [65,65,70]  # Merged
195 questions ÷ 65 = 3 remainder 0 → 3 levels [65,65,65]  # Perfect
```

## 📋 Web App Integration

The integration script automatically updates:

- `/public/quiz/certificates/index.json` - Certificate registry
- `/public/quiz/index.ts` - Frontend imports
- `/lib/certificates.ts` - Certificate library

## 🎯 Supported Commands

### Web Scraper

```bash
python web_scraper.py                    # Fresh start
python web_scraper.py --resume          # Resume interrupted session
python web_scraper.py --retry-failed    # Retry failed questions
python web_scraper.py --reset           # Reset and start over
```

### Question Processor

```bash
python process_certificate.py CERT-ID                           # Default settings
python process_certificate.py CERT-ID 65                        # Custom questions per level
python process_certificate.py CERT-ID 65 10                     # Custom min last level
python process_certificate.py CERT-ID 65 10 10                  # Custom max levels
```

### Certificate Integration

```bash
python integrate_certificate.py CERT-ID                         # Integrate certificate
```

## 📚 Certificate Examples

### AWS Certifications

```bash
# Developer Associate
uv run python process_certificate.py DVA-C02 65 10 10
uv run python integrate_certificate.py DVA-C02

# Solutions Architect Associate
uv run python process_certificate.py SAA-C03 65 10 10
uv run python integrate_certificate.py SAA-C03

# Solutions Architect Professional
uv run python process_certificate.py SAP-C02 65 10 10
uv run python integrate_certificate.py SAP-C02
```

### Azure Certifications

```bash
# Azure Fundamentals
uv run python process_certificate.py AZ-900 40 8 8
uv run python integrate_certificate.py AZ-900

# Azure Administrator
uv run python process_certificate.py AZ-104 60 8 10
uv run python integrate_certificate.py AZ-104
```

### Google Cloud Certifications

```bash
# Cloud Associate
uv run python process_certificate.py Professional-Cloud-Associate 50 8 8
uv run python integrate_certificate.py Professional-Cloud-Associate
```

## ✅ Success Checklist

After adding a new certificate:

- [ ] Questions scraped and saved to `../public/quiz/{cert-id}/raw/questions.json`
- [ ] Questions processed into levels: `level1.json` through `levelN.json`
- [ ] Metadata created: `metadata.json`
- [ ] Certificate appears in selector on web app
- [ ] Levels load correctly
- [ ] Progress tracking works
- [ ] Quiz functionality works

## 🚨 Troubleshooting

### Certificate not appearing?

- Check `certificates/index.json` is updated
- Verify `public/quiz/index.ts` imports are correct
- Ensure `lib/certificates.ts` metadata import exists

### Levels not loading?

- Verify level files exist in correct location
- Check file permissions
- Validate JSON format in level files

### Questions not displaying?

- Check question format matches expected structure
- Verify required fields (question, choices, answers)
- Check for encoding issues
