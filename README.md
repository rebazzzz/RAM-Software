# RAM Software Website

A modern, responsive website for RAM Software - a high-performance software engineering company. Built with semantic HTML, Tailwind CSS, and vanilla JavaScript.

## Project Structure

```
ram-software-website/
├── index.html              # Landing page
├── services.html           # Services deep-dive page
├── case-study.html         # Case study page
├── book-call.html          # Strategy call booking page
├── css/
│   ├── main.css           # Global styles, CSS variables, Tailwind config
│   └── components.css     # Reusable component styles
├── js/
│   ├── main.js            # Shared utilities, component loader, form handler
│   └── pages/
│       ├── landing.js     # Landing page animations
│       ├── services.js    # Services page interactions
│       ├── case-study.js  # Case study animations
│       └── book-call.js   # Calendar and booking functionality
├── components/            # (Reserved for future component files)
└── assets/
    └── images/            # Image assets
```

## Features

### Shared Components

- **Header**: Single-source navigation component loaded via JavaScript
- **Footer**: Single-source footer component loaded via JavaScript
- **Logo**: Terminal icon from Material Symbols (as requested)

### Pages

1. **Landing Page** (`index.html`)
   - Hero section with animated elements
   - Services grid with hover effects
   - Case study previews
   - Bento grid feature section
   - Vision statement

2. **Services Page** (`services.html`)
   - Detailed service descriptions
   - Technology stack showcase
   - Development process timeline
   - Interactive service cards

3. **Case Study Page** (`case-study.html`)
   - Project overview stats
   - Challenge/Solution sections
   - Process timeline
   - Results dashboard
   - Image lightbox functionality

4. **Booking Page** (`book-call.html`)
   - Interactive calendar
   - Time slot selection
   - Form validation
   - Engineer profile card

### Key Features

- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 1024px
- **Dark Mode Support**: CSS variables support dark mode (toggle can be added)
- **Smooth Animations**: Scroll-triggered animations using Intersection Observer
- **Form Handling**: Client-side validation with toast notifications
- **Calendar**: Custom-built calendar with date selection and time slots
- **Performance**: Optimized images, minimal JavaScript, CSS organization

## Design System

### Colors

- Primary: `#3c83f6` (Blue)
- Background Light: `#f9fafb` (Off-white)
- Background Dark: `#101722` (Dark navy)
- Charcoal: `#111827` (Near-black)
- Muted: `#6b7280` (Gray)

### Typography

- Font Family: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800, 900

### Icons

- Material Symbols Outlined (Google Fonts)

## How to Use

### Local Development

1. **Open the project**:

   ```bash
   cd ram-software-website
   ```

2. **Start a local server** (optional but recommended):

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8000`

### Customization

#### Updating the Header/Footer

Edit `js/main.js`:

- `ComponentLoader.loadHeader()` - Modify navigation links, logo, or structure
- `ComponentLoader.loadFooter()` - Update footer content and links

Changes will automatically apply to all pages.

#### Adding a New Page

1. Create `new-page.html` using the template structure
2. Add page-specific JavaScript in `js/pages/new-page.js`
3. Include both scripts at the bottom:
   ```html
   <script src="js/main.js"></script>
   <script src="js/pages/new-page.js"></script>
   ```

#### Modifying Styles

- **Global styles**: Edit `css/main.css`
- **Component styles**: Edit `css/components.css`
- **Page-specific styles**: Add to `css/pages/` and link in the HTML

#### Color Scheme

Update CSS variables in `css/main.css`:

```css
:root {
  --primary: #3c83f6;
  --background-light: #f9fafb;
  --charcoal: #111827;
  /* ... */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- Images use Unsplash placeholders - replace with optimized images for production
- Tailwind CSS loaded via CDN - consider using the CLI for production builds
- JavaScript is modular and page-specific for optimal loading

## Future Enhancements

- [ ] Add dark mode toggle
- [ ] Implement actual booking API integration
- [ ] Add blog section
- [ ] Create contact form with backend
- [ ] Add SEO meta tags dynamically
- [ ] Implement service worker for offline support

## Credits

- Design: Based on RAM Software prototype
- Icons: [Material Symbols](https://fonts.google.com/icons)
- Font: [Inter](https://fonts.google.com/specimen/Inter)
- CSS Framework: [Tailwind CSS](https://tailwindcss.com)

---

Built with ❤️ by RAM Software Engineering Team
