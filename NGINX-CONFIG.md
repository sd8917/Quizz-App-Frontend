`server {
    # Listen on port 80 (HTTP)
    listen 80;
    listen [::]:80;
    
    # Your domain names
    server_name domain-name www.domain.com;
    
    # The directory where your React build files are located
    root /var/www/build-file;
    
    # The default file to serve
    index index.html;

    # Enable gzip compression for better performance
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Basic security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # CRITICAL FOR REACT: Handle Client-Side Routing
    # If a file/folder isn't found, fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (images, CSS, JS, fonts) for 1 year
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Don't cache manifest and service worker files
    location ~* \.(json|xml)$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # Deny access to hidden files (like .env or .git)
    location ~ /\. {
        deny all;
    }

    # Custom error handling
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}

`