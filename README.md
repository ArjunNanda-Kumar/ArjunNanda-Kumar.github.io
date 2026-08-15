# Portfolio Site

Built with [Astro](https://astro.build) + React + Three.js (react-three-fiber) + Framer Motion.
Auto-deploys to GitHub Pages via GitHub Actions on every push to `main`.

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:4321

## Publishing to GitHub Pages

1. Create a GitHub repo named exactly `ArjunNanda-Kumar.github.io` (public, no README).
2. From this project folder:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/ArjunNanda-Kumar/ArjunNanda-Kumar.github.io.git
git push -u origin main
```

3. In the GitHub repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions** (you only need to do this once).
4. Push triggers the workflow in `.github/workflows/deploy.yml`, which
   builds and publishes automatically. Check the **Actions** tab for
   progress. Your site will be live at:

   https://ArjunNanda-Kumar.github.io

## Adding your content

- **Photos/videos**: drop files into `public/images/` and `public/videos/`,
  then reference them as `/images/yourfile.jpg` or `/videos/yourfile.mp4`
  in the relevant page under `src/pages/projects/`.
- **3D / point cloud models**: the viewer (`src/components/ModelViewer.tsx`)
  loads `.glb`/`.gltf` files from `public/models/`. If your point cloud is
  in `.ply` or `.pcd` format, convert it to `.glb` first — easiest options:
  - [CloudCompare](https://www.cloudcompare.org/) (free, open source) can
    import `.ply`/`.pcd` and export `.glb`
  - Blender (free) can also import point clouds and export `.glb`
- **Text content**: edit the `.astro` files directly under
  `src/pages/` and `src/pages/projects/`.

## Project structure

```
src/
  layouts/BaseLayout.astro   -- shared page shell (nav, footer, meta)
  components/Nav.astro       -- navigation bar
  components/Reveal.tsx      -- scroll-triggered fade/slide-in wrapper
  components/ModelViewer.tsx -- interactive 3D/point cloud viewer
  pages/index.astro          -- home page (brief overview + project teasers)
  pages/projects/
    perception.astro         -- perception model deep-dive
    point-cloud.astro        -- 3D modeling / point cloud deep-dive
    agriculture.astro        -- agricultural lab work deep-dive
public/
  models/   -- .glb 3D models go here
  images/   -- photos go here
  videos/   -- video files go here
```
