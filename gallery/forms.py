# gallery/forms.py
from django import forms

class BulkUploadForm(forms.Form):
    """
    Form for bulk image upload in admin
    """
    CATEGORY_CHOICES = [
        ('pre_wedding', 'Pre-Wedding'),
        ('haldi', 'Haldi'),
        ('mehndi', 'Mehndi'),
        ('sagan', 'Sagan'),
        ('rokha', 'Rokha'),
        ('wedding', 'Wedding'),
    ]
    
    category = forms.ChoiceField(
        choices=CATEGORY_CHOICES,
        required=True,
        widget=forms.Select(attrs={'style': 'padding: 8px; width: 200px;'})
    )
    
    is_featured = forms.BooleanField(
        required=False,
        initial=False,
        label='Mark all as Featured',
        widget=forms.CheckboxInput(attrs={'style': 'margin-left: 10px;'})
    )
    
    # Note: We don't define 'images' field here because it's handled by the raw HTML input