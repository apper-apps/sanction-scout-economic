/** @type {import('tailwindcss').Config} */
export default {
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic design system tokens
        border: "#374151",
        input: "#374151", 
        ring: "#DC2626",
        background: "#030712",
        foreground: "#F9FAFB",
        
        // Component-specific tokens
        card: "#111827",
        "card-foreground": "#F9FAFB",
        popover: "#111827",
        "popover-foreground": "#F9FAFB",
        
        // Primary color system
        primary: "#DC2626",
        "primary-foreground": "#FFFFFF",
        
        // Secondary color system  
        secondary: "#1F2937",
        "secondary-foreground": "#F9FAFB",
        
        // Accent color system
        accent: "#F59E0B", 
        "accent-foreground": "#000000",
        
        // Status colors
        destructive: "#EF4444",
        "destructive-foreground": "#FFFFFF",
        
        // Muted colors
        muted: "#374151",
        "muted-foreground": "#9CA3AF",
        
        // Legacy/specific colors
        surface: "#111827",
        success: "#10B981", 
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}