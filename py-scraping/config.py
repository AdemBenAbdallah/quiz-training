#!/usr/bin/env python3
"""
Configuration for AWS Quiz Web Scraper
Centralized settings for different AWS certifications
"""

import os
from typing import Dict, List

# AWS Certification configurations
CERTIFICATIONS = {
    "ANS-C01": {
        "name": "AWS Certified Advanced Networking - Specialty",
        "topics": [1, 2, 3, 4, 5, 6, 7, 8],
        "question_ranges": {
            1: (272, 1),  # Topic 1: questions 272 to 1
            2: (285, 273),  # Topic 2: questions 285 to 273
            3: (321, 286),  # Topic 3: questions 321 to 286
            4: (376, 322),  # Topic 4: questions 376 to 322
            5: (425, 377),  # Topic 5: questions 425 to 377
            6: (470, 426),  # Topic 6: questions 470 to 426
            7: (511, 471),  # Topic 7: questions 511 to 471
            8: (548, 512),  # Topic 8: questions 548 to 512
        },
        "total_questions": 548,
        "search_query_template": "{exam} topic {topic} question {question} discussion"
    },

    "DVA-C02": {
        "name": "AWS Certified Developer - Associate",
        "topics": [1, 2, 3, 4],
        "question_ranges": {
            1: (311, 1),
            2: (623, 312),
            3: (934, 624),
            4: (1244, 935),
        },
        "total_questions": 1244,
        "search_query_template": "{exam} topic {topic} question {question} discussion"
    },

    "SAA-C03": {
        "name": "AWS Certified Solutions Architect - Associate",
        "topics": [1, 2, 3, 4, 5, 6],
        "question_ranges": {
            1: (298, 1),
            2: (597, 299),
            3: (896, 598),
            4: (1195, 897),
            5: (1494, 1196),
            6: (1765, 1495),
        },
        "total_questions": 1765,
        "search_query_template": "{exam} topic {topic} question {question} discussion"
    },

    "SAP-C02": {
        "name": "AWS Certified Solutions Architect - Professional",
        "topics": [1, 2, 3, 4, 5],
        "question_ranges": {
            1: (233, 1),
            2: (466, 234),
            3: (699, 467),
            4: (932, 700),
            5: (1100, 933),
        },
        "total_questions": 1100,
        "search_query_template": "{exam} topic {topic} question {question} discussion"
    }
}


# Global scraper configuration
SCRAPER_CONFIG = {
    "delay_range": (2, 5),  # Random delay between requests (seconds)
    "max_retries": 3,  # Maximum retry attempts per question
    "request_timeout": 30,  # HTTP request timeout (seconds)
    "browser_timeout": 30,  # Browser page load timeout (seconds)
    "headless": False,  # Run browser in headless mode
    "exam_domain": "examtopics.com",  # Domain to filter search results
    "state_file": "state.json",  # State management file
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}


# File paths configuration
FILE_PATHS = {
    "base_dir": "../public/quiz",
    "raw_data_dir": "raw",
    "backups_dir": "backups",
    "metadata_file": "metadata.json"
}


def get_config_for_exam(exam_code: str) -> Dict:
    """Get complete configuration for a specific exam"""
    if exam_code not in CERTIFICATIONS:
        raise ValueError(f"Unknown exam code: {exam_code}")

    exam_config = CERTIFICATIONS[exam_code].copy()

    # Build file paths
    exam_dir = os.path.join(FILE_PATHS["base_dir"], exam_code.lower().replace('-', ''))
    exam_config.update({
        "exam_code": exam_code,
        "current_exam": exam_code,  # Add this for backward compatibility
        "output_dir": os.path.join(exam_dir, FILE_PATHS["raw_data_dir"]),
        "levels_dir": exam_dir,
        "backups_dir": os.path.join(exam_dir, FILE_PATHS["backups_dir"]),
        "levels_config": os.path.join(exam_dir, FILE_PATHS["metadata_file"]),
        "level_files": {
            level: os.path.join(exam_dir, f"level{level}.json")
            for level in range(1, 9)
        }
    })

    # Merge global scraper config
    exam_config.update(SCRAPER_CONFIG)

    return exam_config


def get_all_exam_codes() -> List[str]:
    """Get list of all available exam codes"""
    return list(CERTIFICATIONS.keys())


def validate_exam_config(exam_code: str) -> bool:
    """Validate exam configuration"""
    try:
        config = get_config_for_exam(exam_code)

        # Check required fields
        required_fields = ["name", "topics", "question_ranges", "total_questions"]
        for field in required_fields:
            if field not in config:
                return False

        # Check question ranges
        for topic, (start, end) in config["question_ranges"].items():
            if start <= end:
                return False

        return True

    except Exception:
        return False


# Default configuration for backward compatibility
DEFAULT_CONFIG = get_config_for_exam("ANS-C01")
