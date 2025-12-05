import uuid

def generate_user_id():
    return f"USR{uuid.uuid4().hex[:8].upper()}"

def generate_course_id():
    return f"COURSE{uuid.uuid4().hex[:8].upper()}"

def generate_topic_id():
    return f"TOP{uuid.uuid4().hex[:8].upper()}"

def generate_content_id():
    return f"CONT{uuid.uuid4().hex[:8].upper()}"

def generate_forum_id():
    return f"FORUM{uuid.uuid4().hex[:8].upper()}"

def generate_post_id():
    return f"POST{uuid.uuid4().hex[:8].upper()}"