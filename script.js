// Navigation Active State
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if(link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Drag & Drop Upload (only on media.html)
    const dropZone = document.getElementById('drop-zone');
    if(dropZone) {
        const fileInput = document.getElementById('file-input');
        const imagePreview = document.getElementById('image-preview');
        const uploadBtn = document.getElementById('upload-btn');
        let selectedFiles = [];
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Highlight drop zone
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropZone.style.background = 'rgba(44, 110, 73, 0.1)';
            dropZone.style.borderColor = 'var(--primary)';
            dropZone.style.transform = 'scale(1.02)';
        }
        
        function unhighlight() {
            dropZone.style.background = '';
            dropZone.style.borderColor = '#ddd';
            dropZone.style.transform = '';
        }
        
        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFiles, false);
        
        function handleDrop(e) {
            const files = e.dataTransfer.files;
            handleFileSelection(files);
        }
        
        function handleFiles(e) {
            const files = e.target.files || e.dataTransfer.files;
            handleFileSelection(files);
        }
        
        function handleFileSelection(files) {
            // Filter for images only
            const imageFiles = Array.from(files).filter(file => 
                file.type.match('image.*') && 
                ['image/jpeg', 'image/png'].includes(file.type)
            );
            
            // Limit to 5 images
            if (imageFiles.length > 5) {
                alert('Bitte maximal 5 Bilder auswählen!');
                return;
            }
            
            selectedFiles = imageFiles.slice(0, 5);
            updatePreview();
            uploadBtn.disabled = false;
        }
        
        function updatePreview() {
            imagePreview.innerHTML = '';
            
            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Vorschau ${index + 1}">
                        <div class="remove-btn" data-index="${index}">✕</div>
                    `;
                    imagePreview.appendChild(previewItem);
                }
                
                reader.readAsDataURL(file);
            });
            
            // Add remove functionality
            setTimeout(() => {
                document.querySelectorAll('.remove-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        selectedFiles.splice(index, 1);
                        updatePreview();
                        if (selectedFiles.length === 0) uploadBtn.disabled = true;
                    });
                });
            }, 100);
        }
        
        // Upload simulation (replace with actual API call in production)
        uploadBtn.addEventListener('click', function() {
            if (selectedFiles.length === 0) return;
            
            // Show loading state
            this.innerHTML = '<span class="loading"></span> Wird hochgeladen...';
            this.disabled = true;
            
            // Simulate upload process
            setTimeout(() => {
                alert(`✅ Erfolgreich! ${selectedFiles.length} Bild(er) wurden zur Moderation gesendet.`);
                dropZone.style.background = 'rgba(44, 110, 73, 0.1)';
                setTimeout(() => {
                    dropZone.style.background = '';
                    selectedFiles = [];
                    imagePreview.innerHTML = '';
                    uploadBtn.innerHTML = 'Bilder hochladen';
                    uploadBtn.disabled = true;
                }, 1500);
            }, 1500);
        });
    }
});
