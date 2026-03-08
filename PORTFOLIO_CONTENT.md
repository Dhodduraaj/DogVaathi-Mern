# Portfolio content: Achievements & Videos

## Where to add content

- **Achievements** and **Videos** are managed from the **Admin Panel**.
- Log in as an admin → go to **Admin** → use **Achievements** and **Videos** in the sidebar to add or edit items.

---

## Achievements (images)

1. **Upload images** to a host (e.g. [Cloudinary](https://cloudinary.com)):
   - Create a free account, upload your image, then copy the image **URL** (e.g. `https://res.cloudinary.com/your-cloud/image/upload/...`).
2. **Add an achievement** in Admin → Achievements:
   - Fill in **Title**, **Program name**, **Date**, **Description**.
   - Paste the image **URL** in **Image URL** (optional). The same Cloudinary account used for product images can be used here.
3. The portfolio page **Achievements** shows all items from the database; each can have an image if you set **Image URL**.

**No file upload in the app for achievements** — use an external host (Cloudinary, Imgur, etc.) and paste the URL.

---

## Videos

1. **Videos are links**, not uploaded files:
   - Use **URL** to the video (e.g. Instagram embed URL, YouTube link, or any embeddable URL).
   - For **thumbnail**, upload an image to Cloudinary (or similar), then paste the image URL in **Thumbnail URL** (optional).
2. **Add a video** in Admin → Videos:
   - **Title**: display name.
   - **URL**: the video/embed URL (required).
   - **Platform**: e.g. `instagram`, `youtube` (optional).
   - **Thumbnail URL**: optional image URL for the card.
3. The portfolio **Videos** page lists all videos and opens them in a modal; thumbnails use **Thumbnail URL** or a placeholder.

**Summary:** Upload images/video thumbnails to Cloudinary (or any host), then in Admin → Achievements and Admin → Videos paste the URLs. Video **URL** is the link to the video (e.g. Instagram post embed URL).
