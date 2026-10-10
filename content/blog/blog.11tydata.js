export default {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
	permalink: ({ page }) => {
		const d = page.date;
		const y = d.getUTCFullYear();
		const m = String(d.getUTCMonth() + 1).padStart(2, "0");
		const day = String(d.getUTCDate()).padStart(2, "0");
		return `/${y}/${m}/${day}/${page.fileSlug}.html`;
	},
};
