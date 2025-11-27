const API_BASE = "http://127.0.0.1:5000";
const user_id = 1; // tạm thời user hiện tại

async function loadPosts() {
    let res = await fetch(`${API_BASE}/posts`);
    let posts = await res.json();
    const container = document.getElementById("posts");
    container.innerHTML = "";
    posts.forEach(post => {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${post.title} (by ${post.author})</h3>
                         <p>${post.content}</p>
                         <div id="comments-${post.id}"></div>
                         <input id="comment-${post.id}" placeholder="Viết bình luận">
                         <button onclick="addComment(${post.id})">Bình luận</button>`;
        container.appendChild(div);
        loadComments(post.id);
    });
}

async function loadComments(postId) {
    let res = await fetch(`${API_BASE}/posts/${postId}/comments`);
    let comments = await res.json();
    const div = document.getElementById(`comments-${postId}`);
    div.innerHTML = comments.map(c => `<p>${c.author}: ${c.content}</p>`).join("");
}

async function addComment(postId) {
    const content = document.getElementById(`comment-${postId}`).value;
    await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user_id, content})
    });
    loadComments(postId);
}

document.getElementById("btnPost").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user_id, title, content})
    });
    loadPosts();
});

// load danh sách bài viết khi vào trang
loadPosts();
