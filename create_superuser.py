# create_superuser.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

# Change these credentials - IMPORTANT!
username = 'admin'
email = 'admin@example.com'
password = 'admin'  # CHANGE THIS!

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f'Superuser {username} created successfully!')
else:
    print(f'Superuser {username} already exists.')