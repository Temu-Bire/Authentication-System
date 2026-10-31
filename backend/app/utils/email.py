"""Email utility stub for notifications and resets."""
import logging

logger = logging.getLogger("auth_system.email")


def send_email(to_email: str, subject: str, body: str) -> bool:
    """Send an email notification (placeholder/stub)."""
    logger.info("Sending email to %s with subject: %s", to_email, subject)
    return True
