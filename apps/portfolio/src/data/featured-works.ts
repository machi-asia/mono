import type { FeaturedWork } from "./types";

// Featured Works data
export const featuredWorks: FeaturedWork[] = [
    {
        id: "work1",
        title: "SAMS+",
        description: `Thesis project using ensemble deep learning to recognize students in class and automate real-time attendance plotting.

> [!NOTE]
> Leverages Yolov11n computer vision models paired with facial recognition pipelines.

| Model / Tech | Function | Performance |
|---|---|---|
| **Yolov11n** | Student Detection | 98.4% Accuracy |
| **Facial Recognition** | Attendance Plotting | Real-time |`,
        videoUrl: "/videos/WebDev.mp4",
        tags: ["Yolov11n", "Facial Recognition", "Web Development"],
        link: "https://github.com/kamachi-dev",
    },
    {
        id: "work2",
        title: "Unity Passion Projects",
        description: `A collection of interactive 2D & 3D games developed in Unity, showcasing creativity, gameplay mechanics, and physics programming.

> [!TIP]
> Built using C# and custom Unity Shader Graph materials.

| Component | Technology | Target Platform |
|---|---|---|
| **Game Engine** | Unity Engine | PC & Mobile |
| **Scripting** | C# | Multi-platform |`,
        videoUrl: "/videos/GameDev.mp4",
        tags: ["Unity", "C#", "Game Dev"],
        link: "https://github.com/kamachi-dev",
    },
    {
        id: "work3",
        title: "Blender 3D Models",
        description: `Portfolio of 3D models created using Blender, demonstrating low-poly and high-poly modeling, UV unwrapping, texturing, and rendering.

> [!NOTE]
> All 3D assets are optimized for real-time game engines like Unity.

| Art Asset | Workflow | Output Format |
|---|---|---|
| **3D Modeling** | Blender | FBX / OBJ |
| **Texturing** | UV unwrapping & procedural shaders | PBR Textures |`,
        videoUrl: "/videos/Blender.mp4",
        tags: ["Blender", "3D Modeling", "Texturing"],
        link: "https://github.com/kamachi-dev",
    },
    {
        id: "work4",
        title: "Drawings",
        description: `Artistic hobby and digital illustrations created to equip game projects and UI mockups with custom assets and original concept art.

> [!TIP]
> Digital art assets are drawn natively and exported as high-resolution PNGs.`,
        videoUrl: "/videos/Drawings.mp4",
        tags: ["Art", "Media"],
        link: "https://github.com/kamachi-dev",
    },
    {
        id: "work5",
        title: "TerraPrice",
        description: `Data-driven Machine Learning system predicting food prices based on geographic location, historical market trends, and regional factors.

> [!IMPORTANT]
> Combines agricultural market trend datasets with regression price prediction models.

| Component | Framework | Purpose |
|---|---|---|
| **Backend API** | Flask / Python | Price Inference Engine |
| **Frontend UI** | JavaScript / HTML5 | Interactive Regional Map |`,
        videoUrl: "/videos/TerraPrice.mp4",
        tags: ["Python", "JavaScript", "Flask", "Machine Learning"],
        link: "https://github.com/kamachi-dev/TerraPrice",
    },
];
