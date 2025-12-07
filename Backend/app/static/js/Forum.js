// Biến toàn cục
let Topics = [];
let ForumTopic = [];
let Forums = [];
let currentUser = null;

// Load trang
document.addEventListener("DOMContentLoaded", async () => {
    loadCurrentUser();
    await Promise.all([
        fetchTopics(),
        fetchForumTopics(),
        fetchForumsWithStats()
    ]);

    document.getElementById("btnFilter").onclick = filterForums;
    document.getElementById("searchForum").oninput = filterForums;
    document.getElementById("btnAddForum").onclick = addForum;  // ← Thêm onclick cho tạo forum
});

// Lấy user từ localStorage
function loadCurrentUser() {
    const userData = localStorage.getItem("user");
    if (!userData) return;
    try {
        currentUser = JSON.parse(userData);
    } catch {
        currentUser = { UserID: userData };
    }
}

// Fetch Topics (thêm populate cho newForumTopic)
async function fetchTopics() {
    try {
        const res = await fetch("http://localhost:5000/topics/");
        Topics = res.ok ? await res.json() : [];
        const selectFilter = document.getElementById("filterTopic");
        selectFilter.innerHTML = '<option value="All">Tất cả chủ đề</option>';
        const selectNew = document.getElementById("newForumTopic");
        Topics.forEach(t => {
            selectFilter.appendChild(new Option(t.TopicName, t.TopicID));
            selectNew.appendChild(new Option(t.TopicName, t.TopicID));  // ← Populate cho tạo mới
        });
    } catch (err) {
        console.error("Lỗi tải chủ đề:", err);
    }
}

// Fetch Forum-Topic mapping
async function fetchForumTopics() {
    try {
        const res = await fetch("http://localhost:5000/forums/forumtopic");  // ← Bỏ trailing /
        ForumTopic = res.ok ? await res.json() : [];
    } catch (err) {
        console.error("Lỗi tải mapping:", err);
    }
}

// Fetch forums với stats
async function fetchForumsWithStats() {
    try {
        const res = await fetch("http://localhost:5000/forums/stats");
        if (!res.ok) throw new Error("Không tải được diễn đàn");

        const rawForums = await res.json();

        let joinedIDs = [];
        if (currentUser) {
            try {
                const joinRes = await fetch(`http://localhost:5000/forums/user/${currentUser.UserID}`);
                if (joinRes.ok) {
                    const data = await joinRes.json();
                    joinedIDs = data.map(j => j.ForumID);
                }
            } catch (e) {
                console.warn("Không lấy được danh sách đã tham gia");
            }
        }

        Forums = [];
        for (let f of rawForums) {
            const creatorName = await getUserName(f.UserID);  // ← Thêm để lấy tên
            Forums.push({
                ForumID: f.ForumID,
                ForumName: f.ForumName,
                ForumDescription: f.ForumDescription,
                UserID: f.UserID,
                CreatorName: creatorName,  // ← Lưu tên để hiển thị
                CreatedAt: f.CreatedAt,
                TotalPosts: f.TotalPosts,
                TotalUsers: f.TotalUsers,
                LatestPostTitle: f.LatestPostTitle,
                LatestPostDate: f.LatestPostDate,
                DaysSinceLatestPost: f.DaysSinceLatestPost,
                isJoined: joinedIDs.includes(f.ForumID)
            });
        }

        renderForums(Forums);
    } catch (err) {
        alert("Lỗi tải diễn đàn: " + err.message);
    }
}

// Get User Name (tương tự getLecturerName)
async function getUserName(userID) {
    try {
        const res = await fetch(`http://localhost:5000/users/userinfo?userid=${userID}`);
        if (!res.ok) return "Không rõ";
        const data = await res.json();
        return `${data.LastName} ${data.FirstName}`;
    } catch {
        return "Không rõ";
    }
}

// Render forums (sửa để dùng CreatorName)
function renderForums(forumList) {
    const container = document.getElementById("forumList");
    container.innerHTML = "";

    forumList.forEach(forum => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer";

        card.innerHTML = `
            <h3 class="text-xl font-bold border-b pb-3 mb-3">${forum.ForumName}</h3>
            <p class="text-sm text-gray-600 mb-3">${forum.ForumDescription || "Chưa có mô tả"}</p>
            <p class="text-sm text-gray-600">Người tạo: ${forum.CreatorName}</p>
            <p class="text-sm text-gray-600 mb-3">Ngày tạo: ${forum.CreatedAt}</p>

            <div class="flex gap-4 text-sm text-gray-700 mb-4">
                <span>Bài viết: ${forum.TotalPosts}</span>
                <span id="user-count-${forum.ForumID}">Thành viên: ${forum.TotalUsers}</span>
                <span>Hoạt động: ${forum.DaysSinceLatestPost || 0} ngày trước (${forum.LatestPostTitle || "Chưa có"})</span>
            </div>

            <div class="text-right">
                <button 
                    id="join-btn-${forum.ForumID}"
                    onclick="joinForum('${forum.ForumID}', event)"
                    class="px-6 py-2.5 rounded-lg font-medium transition
                           ${forum.isJoined 
                               ? 'bg-gray-500 text-white cursor-not-allowed' 
                               : 'bg-blue-600 hover:bg-blue-700 text-white'}"
                    ${forum.isJoined ? 'disabled' : ''}>
                    ${forum.isJoined ? 'Đã tham gia' : 'Tham gia ngay'}
                </button>
            </div>
        `;

        card.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openModal(forum);
            }
        });

        container.appendChild(card);
    });
}

// Tham gia forum (sửa URL)
async function joinForum(forumID, event) {
    event.stopPropagation();

    if (!currentUser) {
        alert("Vui lòng đăng nhập để tham gia diễn đàn!");
        return;
    }

    const btn = document.getElementById(`join-btn-${forumID}`);
    const countSpan = document.getElementById(`user-count-${forumID}`);

    btn.disabled = true;
    btn.textContent = "Đang xử lý...";

    try {
        const res = await fetch("http://localhost:5000/forums/forumuser", {  // ← Sửa URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-ID": currentUser.UserID
            },
            body: JSON.stringify({ ForumID: forumID })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Không thể tham gia diễn đàn");
            btn.disabled = false;
            btn.textContent = "Tham gia ngay";
            return;
        }

        btn.textContent = "Đã tham gia";
        btn.className = btn.className.replace(/bg-blue-\d+/, "bg-gray-500");
        btn.disabled = true;

        const currentCount = parseInt(countSpan.textContent.match(/\d+/)[0]);
        countSpan.textContent = `Thành viên: ${currentCount + 1}`;

        const forum = Forums.find(f => f.ForumID === forumID);
        if (forum) {
            forum.isJoined = true;
            forum.TotalUsers += 1;
        }

        alert("Tham gia diễn đàn thành công!");

    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối server");
        btn.disabled = false;
        btn.textContent = "Tham gia ngay";
    }
}

// Lọc & sắp xếp
function filterForums() {
    let filtered = [...Forums];

    const topicID = document.getElementById("filterTopic").value;
    if (topicID !== "All") {
        const ids = ForumTopic.filter(ft => ft.TopicID === topicID).map(ft => ft.ForumID);
        filtered = filtered.filter(f => ids.includes(f.ForumID));
    }

    const keyword = document.getElementById("searchForum").value.toLowerCase().trim();
    if (keyword) {
        filtered = filtered.filter(f => f.ForumName.toLowerCase().includes(keyword));
    }

    const sortBy = document.getElementById("sortOrder").value;
    filtered.sort((a, b) => {
        if (sortBy === "posts") return b.TotalPosts - a.TotalPosts;
        if (sortBy === "users") return b.TotalUsers - a.TotalUsers;
        if (sortBy === "activity") return a.DaysSinceLatestPost - b.DaysSinceLatestPost; // Nhỏ hơn = active hơn
        return 0;
    });

    renderForums(filtered);
}

// Mở modal (sửa để dùng CreatorName)
function openModal(forum) {
    document.getElementById("modalForumName").textContent = forum.ForumName;
    document.getElementById("modalForumDescription").textContent = forum.ForumDescription;
    document.getElementById("modalCreator").textContent = forum.CreatorName;  // ← Dùng tên
    document.getElementById("modalPosts").textContent = forum.TotalPosts;
    document.getElementById("modalUsers").textContent = forum.TotalUsers;
    document.getElementById("modalLatestPost").textContent = forum.LatestPostTitle || "-";
    document.getElementById("modalDaysSince").textContent = forum.DaysSinceLatestPost || "-";
    document.getElementById("modalDate").textContent = forum.CreatedAt;

    document.getElementById("forumModal").classList.remove("hidden");
}

// Thêm Forum mới (tương tự addCourse)
async function addForum() {
    const name = document.getElementById("newForumName").value;
    const desc = document.getElementById("newForumDescription").value;
    const topicID = document.getElementById("newForumTopic").value;

    if (!currentUser) {
        alert("Vui lòng đăng nhập để tạo diễn đàn!");
        return;
    }

    if (!name || !topicID) {
        alert("Vui lòng nhập tên diễn đàn và chọn chủ đề!");
        return;
    }

    const newID = "FRM" + (Forums.length + 1).toString().padStart(3, "0");

    const payload = {
        ForumID: newID,
        ForumName: name,
        ForumDescription: desc,
        UserID: currentUser.UserID,
        TopicID: topicID  // Để backend mapping
    };

    try {
        const res = await fetch("http://localhost:5000/forums/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Lỗi khi tạo diễn đàn mới");

        const data = await res.json();
        alert("Thêm diễn đàn thành công!");

        const creatorName = await getUserName(currentUser.UserID);
        Forums.push({
            ForumID: newID,
            ForumName: name,
            ForumDescription: desc,
            UserID: currentUser.UserID,
            CreatorName: creatorName,
            CreatedAt: new Date().toISOString().slice(0, 10),
            TotalPosts: 0,
            TotalUsers: 0,
            LatestPostTitle: null,
            LatestPostDate: null,
            DaysSinceLatestPost: null,
            isJoined: false
        });

        ForumTopic.push({ ForumID: newID, TopicID: topicID });
        renderForums(Forums);

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}