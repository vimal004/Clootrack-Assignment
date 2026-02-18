import os
import json
from openai import OpenAI

def classify_ticket(description: str):
    """
    Classifies a ticket description using OpenAI's API.
    Returns a dictionary with 'category' and 'priority'.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        # Fallback if no API key is configured
        print("No OpenAI API key found, using default classification.")
        return {"category": "general", "priority": "medium"}

    try:
        client = OpenAI(api_key=api_key)

        prompt = (
            f"Classify the following support ticket description.\n"
            f"Categories: billing, technical, account, general.\n"
            f"Priorities: low, medium, high, critical.\n"
            f"Return a JSON object with keys 'category' and 'priority'.\n\n"
            f"Description: {description}"
        )

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that classifies support tickets. You must return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=60,
            response_format={ "type": "json_object" }
        )

        content = response.choices[0].message.content
        data = json.loads(content)

        # Validate return values
        valid_categories = ['billing', 'technical', 'account', 'general']
        valid_priorities = ['low', 'medium', 'high', 'critical']

        category = data.get('category', 'general').lower()
        priority = data.get('priority', 'medium').lower()

        if category not in valid_categories:
            category = 'general'
        if priority not in valid_priorities:
            priority = 'medium'

        return {"category": category, "priority": priority}

    except Exception as e:
        print(f"LLM Error: {e}")
        # Graceful degradation
        return {"category": "general", "priority": "medium"}
