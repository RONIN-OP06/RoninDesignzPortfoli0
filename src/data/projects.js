// projects data
// images go in public/images/projects/
// videos go in public/videos/projects/

export const projects = [
  {
    id: 1,
    title: "RoninDesignz Portfolio Website",
    description: "A modern portfolio website featuring an interactive project gallery, admin login, and immersive visuals.",
    longDescription: "Built a full-stack portfolio platform that combines a responsive React frontend with serverless APIs. The experience centers on a visually rich project gallery, polished UI/UX, and an admin workflow for managing content. The site is optimized for smooth navigation, clear project storytelling, and a professional presentation across devices.",
    image: "/images/projects/3d/Screenshot (1).png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/Screenshot (1).png" }
    ],
    technologies: ["React", "Vite", "Tailwind CSS", "Netlify Functions"],
    programming: ["JavaScript"],
    category: "Web Development",
    liveLink: "https://ronindesignz.netlify.app",
    githubLink: "https://github.com/RONIN-OP06/RoninDesignzPortfoli0",
    date: "2024",
    features: [
      "Interactive project gallery with rich media support",
      "Admin login flow with protected management routes",
      "Responsive layouts with modern UI styling"
    ],
    challenges: "Balancing visual polish with performance while keeping the gallery fast across devices.",
    results: "Delivered a production-ready portfolio site that highlights projects clearly and professionally."
  },
  {
    id: 2,
    title: "Portfolio Website UI Design",
    description: "Designed and implemented the user interface for my personal portfolio website, focusing on clean layouts, smooth interactions, and intuitive navigation.",
    longDescription: "Created the complete UI design system for this portfolio website, from initial wireframes to final implementation. The design emphasizes a dark theme with glassmorphism effects, gradient accents, and smooth transitions. I focused on making the portfolio showcase intuitive with clear category filtering, easy project browsing, and a detailed project view modal. The responsive design works well on all screen sizes, and the atomic design approach made it easy to maintain consistent styling across components. The UI balances visual appeal with functionality, ensuring visitors can easily explore my work without getting lost.",
    image: "/images/projects/3d/Screenshot (2).png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/Screenshot (2).png" }
    ],
    technologies: ["Figma", "React", "Tailwind CSS", "Shadcn UI"],
    programming: [],
    category: "UI/UX Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Dark theme with glassmorphism effects",
      "Responsive grid layouts for project showcase",
      "Interactive project detail modals",
      "Smooth animations and transitions",
      "Category-based filtering system",
      "Mobile-first responsive design"
    ],
    challenges: "Balancing visual complexity with usability was tricky. I wanted the site to look impressive but not overwhelm visitors. Getting the glassmorphism effects to work well across different backgrounds took some tweaking. Making sure the project modal was easy to navigate on mobile required careful layout adjustments.",
    results: "Created a cohesive design system that makes it easy for visitors to explore my work. The dark theme and smooth interactions give the site a modern, professional feel while keeping navigation straightforward."
  },
  {
    id: 36,
    title: "Login & Signup Flow Redesign",
    description: "Redesigned the authentication flow for better user experience, focusing on clear form layouts, helpful validation messages, and smooth error handling.",
    longDescription: "Worked on improving the login and signup experience for the portfolio platform. The original forms were functional but felt a bit clunky. I redesigned them with better spacing, clearer labels, and more helpful validation feedback. Added real-time validation that shows errors as users type, which helps prevent frustration. The forms now have a cleaner look that matches the rest of the site's design language. Also improved the error messages to be more specific and actionable, so users know exactly what went wrong and how to fix it.",
    image: "/images/projects/3d/Screenshot (3).png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/Screenshot (3).png" }
    ],
    technologies: ["React", "Tailwind CSS", "Form Validation"],
    programming: [],
    category: "UI/UX Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Real-time form validation with clear error messages",
      "Improved visual hierarchy and spacing",
      "Phone number formatting on input",
      "Password strength indicators",
      "Smooth error state transitions",
      "Accessible form labels and inputs"
    ],
    challenges: "Getting the validation timing right was important - showing errors too early feels annoying, but waiting too long is also frustrating. Had to balance when to show validation messages. Making sure the phone number formatting worked smoothly without breaking the input flow took some iteration.",
    results: "The forms are now much more user-friendly. Validation feedback is clear and helpful, and the overall experience feels smoother. Users can complete registration faster with fewer errors."
  },
  {
    id: 37,
    title: "Project Gallery Interface",
    description: "Designed an intuitive project gallery interface that makes it easy to browse and filter through different project categories and view detailed project information.",
    longDescription: "Built the project gallery interface for showcasing my work across different categories. The design uses a card-based layout that works well for both images and videos. I added category filtering so visitors can quickly find what they're interested in. The project detail modal shows all the important information - images, videos, descriptions, technologies used - in a clean, organized way. Navigation between projects within the modal makes it easy to browse without going back to the main gallery. The interface adapts well to different screen sizes, with the grid adjusting from multiple columns on desktop to a single column on mobile.",
    image: "/images/projects/3d/Screenshot (4).png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/Screenshot (4).png" }
    ],
    technologies: ["React", "Tailwind CSS", "Responsive Design"],
    programming: [],
    category: "UI/UX Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Category-based filtering system",
      "Card-based project layout",
      "Full-screen project detail modal",
      "Image and video media support",
      "Navigation arrows between projects",
      "Responsive grid layout"
    ],
    challenges: "Handling different media types (images and videos) in the same interface required careful design. Making sure the modal worked well on mobile with touch gestures was important. The category filtering needed to be obvious but not take up too much space.",
    results: "Created a gallery interface that makes it easy to explore projects. The filtering and modal system work smoothly, and visitors can quickly find and view the work they're interested in."
  },
  {
    id: 3,
    title: "Redbull 3D Model",
    description: "A detailed 3D model and animation of a Redbull can. Showcasing realistic materials, lighting, and motion.",
    longDescription: "This project features a highly detailed 3D model of a Redbull can with realistic materials and textures. The animation demonstrates advanced 3D rendering techniques including proper lighting, reflections, and motion. The model was created with attention to detail in every aspect, from the can's texture to the liquid inside.",
    image: "/images/projects/3d/redbullscan.png",
    video: "/videos/projects/3d/0001-0240 - Copy.mp4",
    mediaType: "video",
    media: [
      { type: "image", url: "/images/projects/3d/redbullscan.png" },
      { type: "video", url: "/videos/projects/3d/0001-0240 - Copy.mp4" }
    ],
    technologies: ["Blender", "3D Modeling", "Animation",],
    programming: [],
    category: "3D Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Realistic material and texture mapping",
      "Smooth animation with proper motion",
      "Professional lighting and rendering",
      "High-quality 3D model detail"
    ],
    challenges: "Creating realistic materials and achieving smooth animation transitions required careful attention to detail and multiple iterations. Optimizing the machine for clearer renders.",
    results: "Successfully created a photorealistic 3D model with smooth animation that demonstrates professional 3D rendering capabilities."
  },
  {
    id: 5,
    title: "Ring 3D Render",
    description: "A 3D rendered ring with detailed animation showcasing jewelry design and rendering techniques.",
    longDescription: "This project demonstrates 3D jewelry rendering with a focus on metallic materials, gemstone reflections, and elegant animation. The ring model showcases precision in 3D design and the ability to create photorealistic renders of jewelry pieces.",
    image: "/images/projects/3d/untitled.png",
    video: "/videos/projects/3d/0001-0201.mp4",
    mediaType: "video",
    media: [
      { type: "image", url: "/images/projects/3d/untitled.png" },
      { type: "video", url: "/videos/projects/3d/0001-0201.mp4" }
    ],
    technologies: ["Blender", "Jewelry Design", "3D Rendering", "Animation"],
    programming: [],
    category: "3D Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Detailed jewelry 3D modeling",
      "Metallic material rendering",
      "Smooth rotation animation",
      "Professional lighting setup"
    ],
    challenges: "Achieving realistic metallic reflections and gemstone properties required careful material tuning and lighting setup.",
    results: "Created a photorealistic jewelry render with smooth animation that effectively showcases the ring's design and materials."
  },
  {
    id: 6,
    title: "Bed Render Collection",
    description: "A collection of a 3D modelled bed design made for TheMakersShed, a carpentry company based in Cape Town, Durbanville.",
    longDescription: "This project features 3D renders of abed design, namely double bunk bed.",
    image: "/images/projects/3d/DoubleBunk.png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/DoubleBunk.png" },
      { type: "image", url: "/images/projects/3d/bed1.png" },
      { type: "image", url: "/images/projects/3d/bed4.png" },
      { type: "image", url: "/images/projects/3d/bed5.png" },
      { type: "image", url: "/images/projects/3d/bed6.png" }
    ],
    technologies: ["Blender",],
    programming: [],
    category: "3D Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Multiple bed design variations",
      "Realistic furniture rendering",
      "Interior design visualization",
      "Material and texture work"
    ],
    challenges: "Creating multiple design variations while maintaining consistency in quality across all renders within theallocated time frame due to client revisions.",
    results: "Successfully created a comprehensive collection of bed renders that demonstrate design versatility and technical skill."
  },
  {
    id: 7,
    title: "Cupboard Render Series",
    description: "An extensive series of a 3D rendered cupboard and storage solutions with various configurations.",
    longDescription: "This project showcases a comprehensive collection of 3D rendered cupboards, drawers, and storage solutions. The series includes single and double drawer configurations, shelf variations, and mat renderings. Each piece demonstrates attention to detail in furniture design, material application, and realistic rendering techniques.",
    image: "/images/projects/3d/RENDER.png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/RENDER.png" },
      { type: "image", url: "/images/projects/3d/2Shelf1.png" },
      { type: "image", url: "/images/projects/3d/2Shelf2.png" },
      { type: "image", url: "/images/projects/3d/doubleDraw1.png" },
      { type: "image", url: "/images/projects/3d/doubleDraw2.png" },
      { type: "image", url: "/images/projects/3d/doubleDraw3.png" },
      { type: "image", url: "/images/projects/3d/singleDraw.png" },
      { type: "image", url: "/images/projects/3d/SingleDraw2.png" },
      { type: "image", url: "/images/projects/3d/SinglDraw3.png" },
      { type: "image", url: "/images/projects/3d/Mat1.png" },
      { type: "image", url: "/images/projects/3d/mat2.png" },
      { type: "image", url: "/images/projects/3d/Mat3.png" },
      { type: "image", url: "/images/projects/3d/Mat4.png" },
      { type: "image", url: "/images/projects/3d/MatRender.png" },
      { type: "image", url: "/images/projects/3d/IMG_20241023_050226.png" },
      { type: "image", url: "/images/projects/3d/IMG_20241023_050327.png" }
    ],
    technologies: ["Blender", "3D Modeling", "Furniture Design", "Product Visualization"],
    programming: [],
    category: "3D Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Multiple cupboard configurations",
      "Drawer and shelf variations",
      "Realistic material rendering",
      "Professional product visualization"
    ],
    challenges: "Managing and ensuring each render maintains high quality and realistic appearance.",
    results: "Created an extensive series of professional furniture renders that effectively showcase design options and technical capabilities."
  },
  {
    id: 8,
    title: "Shelf Render Collection",
    description: "A collection of 3D rendered shelf designs with various styles and configurations.",
    longDescription: "This project features multiple 3D renders of shelf designs, showcasing different styles, materials, and configurations. Each render demonstrates the ability to create realistic furniture visualizations with proper lighting, materials, and composition.",
    image: "/images/projects/3d/SHELF1.png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/SHELF1.png" },
      { type: "image", url: "/images/projects/3d/SHELF2.png" },
      { type: "image", url: "/images/projects/3d/shelf3.png" },
      { type: "image", url: "/images/projects/3d/ShelfR1.png" },
      { type: "image", url: "/images/projects/3d/SHELFR2.png" }
    ],
    technologies: ["Blender", "3D Modeling", ],
    category: "3D Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Multiple shelf design variations",
      "Realistic material rendering",
      "Professional lighting",
      "Product visualization"
    ],
    challenges: "Creating diverse shelf designs while maintaining visual consistency and quality across all renders.",
    results: "Successfully created a collection of shelf renders."
  },
  {
    id: 9,
    title: "Electronics Render",
    description: "A detailed 3D render of electronic components showcasing technical product visualization.",
    longDescription: "This project features a detailed 3D render of electronic components, specifically a grinder's internal mechanism. The render demonstrates technical product visualization skills, attention to mechanical detail, and the ability to create realistic renders of complex electronic and mechanical systems.",
    image: "/images/projects/3d/GrinderGuts.png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/GrinderGuts.png" }
    ],
    technologies: ["Blender"],
    programming: [],
    category: "3D Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Detailed mechanical component rendering",
      "Technical product visualization",
      "Realistic material representation",
      "Professional technical documentation style"
    ],
    challenges: "Accurately representing complex mechanical components and ensuring technical accuracy in the visualization.",
    results: "Created a detailed technical render that effectively communicates the internal structure and components of the product."
  },
  {
    id: 4,
    title: "Self Portrait - Bias Self",
    description: "A self-portrait illustration showcasing personal artistic style and technique.",
    longDescription: "A personal self-portrait piece that demonstrates skill in portrait illustration and character representation. This work showcases attention to detail in facial features, expression, and artistic interpretation.",
    image: "/images/projects/2d/Bias_Self.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/2d/Bias_Self.jpg" }
    ],
    technologies: ["Digital Painting"],
    programming: [],
    category: "2D Illustration & Animations",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Portrait illustration",
      "Character representation",
      "Digital painting techniques"
    ],
    challenges: "Capturing personal likeness while maintaining artistic style and expression.",
    results: "Created a compelling self-portrait that showcases portrait illustration skills."
  },
  {
    id: 11,
    title: "Doorway 3D Render",
    description: "A 3D rendered doorway scene showcasing architectural visualization and rendering techniques.",
    longDescription: "A 3D render of an architectural doorway scene demonstrating skill in 3D modeling, lighting, and rendering. This work showcases understanding of architectural visualization, material application, and realistic rendering techniques.",
    image: "/images/projects/3d/1000025457.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/1000025457.jpg" }
    ],
    technologies: ["Blender", "3D Rendering", "Architectural Visualization"],
    programming: [],
    category: "3D Design",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Architectural 3D modeling",
      "Realistic lighting and materials",
      "Professional rendering"
    ],
    challenges: "Creating realistic architectural details and achieving proper lighting for the scene.",
    results: "Produced a photorealistic 3D render that demonstrates architectural visualization skills."
  },
  {
    id: 12,
    title: "Monster Design Concept",
    description: "A monster character design showcasing creative creature concept art.",
    longDescription: "A creative monster design that demonstrates character concept art skills. This piece showcases imagination in creature design, combining various elements to create a unique and compelling character.",
    image: "/images/projects/2d/1000025458.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/2d/1000025458.jpg" }
    ],
    technologies: ["Character Design", "Concept Art", "Digital Painting"],
    programming: [],
    category: "2D Illustration & Animations",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Creature design",
      "Character concept art",
      "Creative imagination"
    ],
    challenges: "Designing a unique and compelling monster character that is both creative and visually interesting.",
    results: "Created an original monster design that showcases character concept art abilities."
  },
  {
    id: 13,
    title: "Painting Study 1",
    description: "A painting study exploring color, composition, and artistic expression.",
    longDescription: "A painting study that demonstrates skill in color theory, composition, and painting techniques. This work showcases artistic vision and technical ability in art creation.",
    image: "/images/projects/2d/1000025454.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/2d/1000025454.jpg" }
    ],
    technologies: ["Painting"],
    programming: [],
    category: "2D Illustration & Animations",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Painting techniques",
      "Color and composition",
      "Artistic expression"
    ],
    challenges: "Creating a compelling painting with strong composition and effective use of color.",
    results: "Produced a painting study that demonstrates artistic skill and technical ability."
  },
  {
    id: 14,
    title: "Digital Painting",
    description: "A digital painting showcasing artistic style and technique.",
    longDescription: "A digital painting that demonstrates versatility in digital art creation. This piece showcases understanding of lighting, color, and composition in digital painting.",
    image: "/images/projects/2d/1000025464.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/2d/1000025464.jpg" }
    ],
    technologies: ["Digital Painting"],
    programming: [],
    category: "2D Illustration & Animations",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Digital painting",
      "Color theory",
      "Composition"
    ],
    challenges: "Achieving desired mood and atmosphere through color and lighting choices.",
    results: "Created a digital painting that effectively conveys artistic vision."
  },
  {
    id: 15,
    title: "Painting Study 2",
    description: "A painting study exploring artistic themes and visual storytelling.",
    longDescription: "A painting study that demonstrates skill in visual storytelling and artistic expression. This work showcases ability to create compelling imagery through painting techniques.",
    image: "/images/projects/2d/1000025484.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/2d/1000025484.jpg" }
    ],
    technologies: ["Painting"],
    programming: [],
    category: "2D Illustration & Animations",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Visual storytelling",
      "Painting techniques",
      "Artistic expression"
    ],
    challenges: "Creating imagery that effectively communicates artistic intent and emotion.",
    results: "Produced a painting study that demonstrates storytelling through visual art."
  },
  {
    id: 16,
    title: "Perspective Work Collection",
    description: "A collection of perspective drawings exploring depth, architectural forms, and spatial relationships.",
    longDescription: "A series of perspective drawings focusing on architectural elements and spatial relationships. These studies showcase understanding of one-point and two-point perspective, depth, and structural drawing techniques. The collection demonstrates skill in representing three-dimensional space and architectural forms in two dimensions.",
    image: "/images/projects/2d/1000025461.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/2d/1000025461.jpg" },
      { type: "image", url: "/images/projects/2d/1000025470.jpg" }
    ],
    technologies: ["Perspective Drawing", "Architectural Illustration", "Technical Drawing"],
    programming: [],
    category: "2D Illustration & Animations",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Perspective techniques",
      "Architectural elements",
      "Spatial understanding",
      "Depth representation"
    ],
    challenges: "Accurately representing three-dimensional space and architectural forms in two dimensions while maintaining artistic quality.",
    results: "Created a collection of perspective studies that demonstrate strong understanding of spatial relationships and architectural drawing."
  },
  {
    id: 18,
    title: "Streamer Artwork Collection",
    description: "A collection of artwork created for streaming content, including manga-style illustrations and digital graphics.",
    longDescription: "A diverse collection of artwork designed for streaming and digital content presentation. This includes manga-style illustrations, character artwork, and various digital pieces created for online platforms and streaming content. The collection demonstrates ability to create engaging visuals suitable for streaming while maintaining artistic quality.",
    image: "/images/projects/2d/1000025452.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/2d/1000025452.jpg" },
      { type: "image", url: "/images/projects/2d/manga_cleaned_1.png" },
      { type: "image", url: "/images/projects/2d/manga_cleaned_2.png" },
      { type: "image", url: "/images/projects/2d/manga_cleaned_3.png" },
      { type: "image", url: "/images/projects/2d/manga_cleaned_4.png" },
      { type: "image", url: "/images/projects/2d/manga_cleaned_5.png" },
      { type: "image", url: "/images/projects/2d/manga_cleaned_6.png" }
    ],
    technologies: ["Manga Illustration", "Digital Art", "Streaming Graphics"],
    programming: [],
    category: "2D Illustration & Animations",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Manga-style illustrations",
      "Streaming graphics",
      "Digital illustration",
      "Sequential art panels",
      "Online content design"
    ],
    challenges: "Creating artwork that is engaging and suitable for streaming platforms while maintaining artistic quality and visual appeal.",
    results: "Produced a collection of streaming artwork including manga-style illustrations that demonstrate versatility in digital content creation."
  },
  {
    id: 19,
    title: "Hand Study Collection",
    description: "A comprehensive collection of hand anatomy studies showcasing understanding of form, structure, and gesture.",
    longDescription: "A series of hand studies focusing on anatomy, gesture, and form. These illustrations demonstrate skill in understanding human anatomy and the complexity of hand structure. The collection explores different angles, poses, and lighting conditions, showcasing comprehensive understanding of hand anatomy and ability to represent hands with both accuracy and artistic expression.",
    image: "/images/projects/2d/1000025465.jpg",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/2d/1000025465.jpg" },
      { type: "image", url: "/images/projects/2d/1000025466.jpg" },
      { type: "image", url: "/images/projects/2d/1000025467.jpg" },
      { type: "image", url: "/images/projects/2d/1000025472.jpg" },
      { type: "image", url: "/images/projects/2d/1000025473.jpg" },
      { type: "image", url: "/images/projects/2d/1000025487.jpg" },
      { type: "image", url: "/images/projects/2d/1000025488.jpg" },
      { type: "image", url: "/images/projects/2d/1000025489.jpg" },
      { type: "image", url: "/images/projects/2d/1000025490.jpg" },
      { type: "image", url: "/images/projects/2d/1000025491.jpg" },
      { type: "image", url: "/images/projects/2d/1000025492.jpg" }
    ],
    technologies: ["Anatomy Study", "Digital Drawing"],
    programming: [],
    category: "2D Illustration & Animations",
    liveLink: null,
    githubLink: null,
    date: "2024",
    features: [
      "Hand anatomy studies",
      "Multiple angles and poses",
      "Gesture and form exploration",
      "Lighting and shading techniques",
      "Detailed anatomical representation"
    ],
    challenges: "Capturing the complex structure and movement of hands with accuracy and artistic expression across multiple studies.",
    results: "Created a comprehensive collection of hand studies demonstrating strong understanding of anatomy, form, and gesture in hand illustration."
  },
  {
    id: 10,
    title: "RoninDesignz - Full-Stack Portfolio Platform",
    description: "A modern, professional full-stack web application featuring user authentication, member management, interactive 3D visualizations, and a dynamic portfolio showcase. Built with React, Express.js, and Three.js using atomic design principles.",
    longDescription: "Developed a comprehensive full-stack portfolio platform that combines modern web technologies with interactive 3D experiences. The application features a complete authentication system with user registration and login functionality, member management API, and a dynamic portfolio showcase for 3D renders and projects. Built using atomic design principles, the frontend is constructed with React 18, Vite, and Shadcn UI components, providing a clean, maintainable codebase. The backend is powered by Express.js with RESTful API endpoints for member management and authentication. The platform includes interactive Three.js scenes with advanced shader effects, parallax scrolling animations, and a responsive design that works seamlessly across all devices. Form validation, error handling, and a centralized configuration system ensure robust functionality. The application serves as both a portfolio showcase and a demonstration of full-stack development capabilities, integrating frontend interactivity with backend data management.",
    image: "/images/projects/3d/Screenshot (5).png",
    video: null,
    mediaType: "image",
    media: [
      { type: "image", url: "/images/projects/3d/Screenshot (5).png" }
    ],
    technologies: ["React", "Express.js", "Vite", "Three.js", "React Router", "Shadcn UI", "Tailwind CSS", "Node.js"],
    programming: ["JavaScript", "ES6 Modules", "JSX"],
    category: "Programming & Software Development",
    liveLink: "https://ronindesignz.netlify.app",
    githubLink: "https://github.com/RONIN-OP06/RoninDesignzPortfoli0",
    date: "2024",
    features: [
      "Full-stack architecture with React frontend and Express.js backend",
      "User authentication system with secure login and registration",
      "RESTful API endpoints for member management and data persistence",
      "Interactive 3D scenes using Three.js with advanced shader effects",
      "Atomic design architecture for maintainable, scalable code structure",
      "Real-time form validation with comprehensive error handling",
      "Responsive design with dark theme and glassmorphism effects",
      "Parallax scrolling animations and gradient background effects",
      "Dynamic portfolio showcase with image and video media support",
      "Centralized configuration management for easy customization"
    ],
    challenges: "Integrating Three.js 3D scenes with React required careful state management and performance optimization to ensure smooth animations. Implementing the authentication system with file-based storage (JSON) while maintaining security best practices was a key challenge. Creating a cohesive user experience across multiple pages with consistent styling and navigation required careful attention to component architecture. The atomic design pattern helped organize the codebase, but required upfront planning to ensure proper component hierarchy. Handling video file serving with proper MIME types and CORS configuration for development and production environments required careful Express.js middleware setup.",
    results: "Successfully delivered a production-ready full-stack application that showcases both technical skills and creative work. The platform effectively demonstrates proficiency in modern web development, from frontend React development to backend API design. The atomic design architecture makes the codebase maintainable and easy to extend. The integration of 3D visualizations adds a unique, engaging element that sets the portfolio apart. The authentication and member management system provides a foundation for future features like user dashboards and project management capabilities."
  }
  // add more projects here if needed
]

// get project by id - memoized lookup
const projectMap = new Map()
projects.forEach(p => projectMap.set(p.id, p))

export function getProjectById(id) {
  return projectMap.get(parseInt(id)) || projects.find(project => project.id === parseInt(id))
}
