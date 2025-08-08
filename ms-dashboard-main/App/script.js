document.addEventListener('DOMContentLoaded', () => {
  // --- User Session ---
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    window.location.href = 'login.html';
    return;
  }

  // --- Modules Data ---
  const modulesData = {
    "modules": [
      {
        "id": "dashboard", "name": "Dashboard", "icon": "bi-speedometer2",
        "subSections": [
          { "id": "overview", "name": "Overview" },
          { "id": "reports", "name": "Reports" },
          { "id": "analytics", "name": "Analytics" },
          { "id": "system-overview", "name": "System Overview" },
          { "id": "analytics-reports", "name": "Analytics Reports" },
          { "id": "quick-actions", "name": "Quick Actions & Features" },
          { "id": "team-chat-dash", "name": "Team Chat" },
          { "id": "private-messages", "name": "Private Messages" },
          { "id": "activities-dash", "name": "Activities" },
          { "id": "notifications", "name": "Notifications" },
          { "id": "calendar", "name": "Calendar" },
          { "id": "file-manager", "name": "File Manager" },
          { "id": "time-tracking", "name": "Time Tracking" },
          { "id": "project-management", "name": "Project Management" },
          { "id": "Global Styles", "name": "Global Styles" },
          { "id": "Posts", "name": "Posts" },
          { "id": "Data Source Integration", "name": "Data Source Integration" },
          { "id": "Appearance", "name": "Appearance" },
          { "id": "Navigation", "name": "Navigation" },
          { "id": "Alerts and Notifications", "name": "Alerts and Notifications" },
          { "id": "reports", "name": "Reports" },
          { "id": "analytics", "name": "Analytics" }
        ]
      },
      {
        "id": "chat", "name": "Team Chat", "icon": "bi-people-fill",
        "subSections": [{ "id": "general-chat", "name": "General Chat" }]
      },
      {
        "id": "Private Chat", "name": "Chat", "icon": "bi bi-chat",
        "subSections": [
          { "id": "user-management", "name": "User Management" },
          { "id": "integrations", "name": "Integrations" },
          { "id": "preferences", "name": "Preferences" }
        ]
      },
      {
        "id": "Activity", "name": "Activity", "icon": "bi bi-activity",
        "subSections": [
          { "id": "All Activity", "name": "All Activity" },
          { "id": "Filter Activity", "name": "Filter Activity" },
          { "id": "Mark as Read/Unread", "name": "Mark as Read/Unread" }
        ]
      },
      {
        "id": "deals", "name": "Deals", "icon": "bi-cash-stack",
        "subSections": [
          { "id": "active-deals", "name": "Active Deals" },
          { "id": "closed-deals", "name": "Closed Deals" },
          { "id": "pipeline-view", "name": "Pipeline View" }
        ]
      },
      {
        "id": "tasks", "name": "Tasks", "icon": "bi-check2-square",
        "subSections": [
          { "id": "my-tasks", "name": "My Tasks" },
          { "id": "team-tasks", "name": "Team Tasks" },
          { "id": "calendar", "name": "Calendar" }
        ]
      },
      {
        "id": "campaigns", "name": "Campaigns", "icon": "bi-megaphone-fill",
        "subSections": [
          { "id": "active-campaigns", "name": "Active Campaigns" },
          { "id": "past-campaigns", "name": "Past Campaigns" }
        ]
      },
      {
        "id": "support", "name": "Support", "icon": "bi-headset",
        "subSections": [
          { "id": "open-tickets", "name": "Open Tickets" },
          { "id": "knowledge-base", "name": "Knowledge Base" }
        ]
      },
      {
        "id": "customers", "name": "Customers", "icon": "bi bi-telephone",
        "subSections": [
          { "id": "all-customers", "name": "All Customers" },
          { "id": "leads", "name": "Leads" },
          { "id": "accounts", "name": "Accounts" }
        ]
      },
      {
        "id": "settings", "name": "Settings", "icon": "bi-gear-fill",
        "subSections": [
          { "id": "integrations", "name": "Integrations" },
          { "id": "preferences", "name": "Preferences" },
          { "id": "user-management", "name": "User Management" }
        ]
      },
    /*  {
        "id": "admin", "name": "System Admin", "icon": "bi-shield-lock-fill",
        "subSections": [
          { "id": "login-history", "name": "Login History" },
          { "id": "user-export", "name": "User Export" },
          { "id": "system-logs", "name": "System Logs" }
        ]
      }*/
    ]
  };

  const state = { activeModuleIcon: null, activeSubSectionItem: null };
  const userManagementModal = new bootstrap.Modal(document.getElementById('userManagementModal'));

  const el = {
    miniSidebar: document.getElementById("miniSidebar"),
    subSidebar: document.getElementById("subSidebar"),
    subList: document.getElementById("subList"),
    searchInput: document.getElementById("searchInput"),
    expandBtn: document.getElementById("expandBtn"),
    mainContent: document.getElementById("mainContent"),
    dragHandle: document.getElementById("dragHandle"),
    dataDisplay: document.getElementById("dataDisplay"),
    mainContentHeader: document.getElementById("mainContentHeader"),
    userName: document.getElementById("userName"),
    logoutBtn: document.getElementById("logoutBtn"),
    appContainer: document.getElementById('app-container'),
    toastContainer: document.querySelector('.toast-container'),
    themeToggle: document.getElementById('theme-toggle')
  };

  const showToast = (message, type = 'success') => {
    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;
    el.toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
  };

  const renderIcons = (filter = "") => {
    el.miniSidebar.innerHTML = "";
    modulesData.modules.forEach(module => {
      if (module.name.toLowerCase().includes(filter) || module.subSections.some(s => s.name.toLowerCase().includes(filter))) {
        const iconDiv = document.createElement("div");
        iconDiv.className = 'icon-wrapper';
        iconDiv.innerHTML = `<i class="bi ${module.icon} fs-4"></i>`;
        iconDiv.title = module.name;
        iconDiv.addEventListener("click", () => {
          if (state.activeModuleIcon) state.activeModuleIcon.classList.remove('active');
          iconDiv.classList.add('active');
          state.activeModuleIcon = iconDiv;
          loadSubSections(module);
        });
        el.miniSidebar.appendChild(iconDiv);
      }
    });
  };

  const loadSubSections = (module) => {
    el.subSidebar.querySelector("h6").textContent = module.name;
    el.subList.innerHTML = "";
    el.mainContentHeader.textContent = module.name;

    module.subSections.forEach((sub, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.textContent = sub.name;
      li.addEventListener("click", () => {
        if (state.activeSubSectionItem) state.activeSubSectionItem.classList.remove('active');
        li.classList.add('active');
        state.activeSubSectionItem = li;
        renderContent(module, sub);
      });
      el.subList.appendChild(li);
      if (index === 0) li.click();
    });
  };

  function logActivity(type, details) {
    const activity = {
      type,
      details,
      user: loggedInUser.username,
      email: loggedInUser.email,
      timestamp: new Date().toISOString(),
      read: false
    };
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  function renderAllActivities() {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []).reverse();
    el.dataDisplay.innerHTML = `
      <h3>Activity Log</h3>
      <form id="addActivityForm" class="mb-3 d-flex">
        <input type="text" id="activityInput" class="form-control me-2" placeholder="Add an activity..." required>
        <button type="submit" class="btn btn-primary">Add</button>
      </form>
      <ul id="activityList" class="list-group mb-3">
        ${activities.length ? activities.map((act, idx) => `
          <li class="list-group-item d-flex justify-content-between align-items-center ${act.read ? 'bg-light' : ''}">
            <div>
              <div><strong>${act.user}</strong> (${act.type})</div>
              <div>${typeof act.details === 'string' ? act.details : JSON.stringify(act.details)}</div>
              <div class="text-muted small">${new Date(act.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-success mark-read-btn" data-idx="${idx}">${act.read ? 'Unread' : 'Read'}</button>
              <button class="btn btn-sm btn-outline-danger delete-activity-btn" data-idx="${idx}">Delete</button>
            </div>
          </li>
        `).join('') : `<li class="list-group-item text-muted">No activities yet.</li>`}
      </ul>
      <div class="mb-2">
        <input type="text" id="filterActivityInput" class="form-control" placeholder="Filter activities by keyword...">
      </div>
    `;

    document.getElementById('addActivityForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('activityInput');
      const desc = input.value.trim();
      if (desc) {
        logActivity('custom', desc);
        input.value = '';
        renderAllActivities();
        showToast('Activity added successfully!', 'success');
      }
    });

    document.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        toggleReadActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.getElementById('filterActivityInput').addEventListener('input', function() {
      filterActivities(this.value.trim().toLowerCase());
    });
  }

  function toggleReadActivity(idx) {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []);
    const realIdx = activities.length - 1 - idx;
    if (activities[realIdx]) {
      activities[realIdx].read = !activities[realIdx].read;
      localStorage.setItem('activities', JSON.stringify(activities));
      renderAllActivities();
    }
  }

  function deleteActivity(idx) {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []);
    const realIdx = activities.length - 1 - idx;
    if (activities[realIdx]) {
      activities.splice(realIdx, 1);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderAllActivities();
    }
  }

  function filterActivities(keyword) {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []).reverse();
    const filtered = activities.filter(act =>
      (act.user && act.user.toLowerCase().includes(keyword)) ||
      (act.type && act.type.toLowerCase().includes(keyword)) ||
      (typeof act.details === 'string' && act.details.toLowerCase().includes(keyword))
    );
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = filtered.length
      ? filtered.map((act, idx) => `
        <li class="list-group-item d-flex justify-content-between align-items-center ${act.read ? 'bg-light' : ''}">
          <div>
            <div><strong>${act.user}</strong> (${act.type})</div>
            <div>${typeof act.details === 'string' ? act.details : JSON.stringify(act.details)}</div>
            <div class="text-muted small">${new Date(act.timestamp).toLocaleString()}</div>
          </div>
          <div>
            <button class="btn btn-sm btn-outline-success mark-read-btn" data-idx="${idx}">${act.read ? 'Unread' : 'Read'}</button>
            <button class="btn btn-sm btn-outline-danger delete-activity-btn" data-idx="${idx}">Delete</button>
          </div>
        </li>
      `).join('')
      : `<li class="list-group-item text-muted">No activities found.</li>`;

    document.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        toggleReadActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteActivity(parseInt(this.getAttribute('data-idx')));
      });
    });
  }

  function renderFilterActivity() {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []).reverse();
    el.dataDisplay.innerHTML = `
      <h3>Filter Activities</h3>
      <div class="mb-3">
        <input type="text" id="filterActivityInput" class="form-control" placeholder="Filter activities by keyword...">
      </div>
      <ul id="activityList" class="list-group mb-3">
        ${activities.length ? activities.map((act, idx) => `
          <li class="list-group-item d-flex justify-content-between align-items-center ${act.read ? 'bg-light' : ''}">
            <div>
              <div><strong>${act.user}</strong> (${act.type})</div>
              <div>${typeof act.details === 'string' ? act.details : JSON.stringify(act.details)}</div>
              <div class="text-muted small">${new Date(act.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-success mark-read-btn" data-idx="${idx}">${act.read ? 'Unread' : 'Read'}</button>
              <button class="btn btn-sm btn-outline-danger delete-activity-btn" data-idx="${idx}">Delete</button>
            </div>
          </li>
        `).join('') : `<li class="list-group-item text-muted">No activities yet.</li>`}
      </ul>
    `;

    document.getElementById('filterActivityInput').addEventListener('input', function() {
      filterActivities(this.value.trim().toLowerCase());
    });

    document.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        toggleReadActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteActivity(parseInt(this.getAttribute('data-idx')));
      });
    });
  }

  function renderMarkAsReadUnread() {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []).reverse();
    const unreadCount = activities.filter(act => !act.read).length;
    
    el.dataDisplay.innerHTML = `
      <h3>Mark as Read/Unread</h3>
      <div class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        You have <strong>${unreadCount}</strong> unread activities
      </div>
      <div class="mb-3">
        <button class="btn btn-success me-2" id="markAllRead">
          <i class="bi bi-check-all me-1"></i>Mark All as Read
        </button>
        <button class="btn btn-warning" id="markAllUnread">
          <i class="bi bi-x-circle me-1"></i>Mark All as Unread
        </button>
      </div>
      <ul id="activityList" class="list-group mb-3">
        ${activities.length ? activities.map((act, idx) => `
          <li class="list-group-item d-flex justify-content-between align-items-center ${act.read ? 'bg-light' : ''}">
            <div>
              <div><strong>${act.user}</strong> (${act.type})</div>
              <div>${typeof act.details === 'string' ? act.details : JSON.stringify(act.details)}</div>
              <div class="text-muted small">${new Date(act.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-success mark-read-btn" data-idx="${idx}">${act.read ? 'Unread' : 'Read'}</button>
              <button class="btn btn-sm btn-outline-danger delete-activity-btn" data-idx="${idx}">Delete</button>
            </div>
          </li>
        `).join('') : `<li class="list-group-item text-muted">No activities yet.</li>`}
      </ul>
    `;

    document.getElementById('markAllRead').addEventListener('click', function() {
      const activities = JSON.parse(localStorage.getItem('activities')) || [];
      activities.forEach(act => act.read = true);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderMarkAsReadUnread();
    });

    document.getElementById('markAllUnread').addEventListener('click', function() {
      const activities = JSON.parse(localStorage.getItem('activities')) || [];
      activities.forEach(act => act.read = false);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderMarkAsReadUnread();
    });

    document.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        toggleReadActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteActivity(parseInt(this.getAttribute('data-idx')));
      });
    });
  }

  const renderChatInterface = () => {
    el.dataDisplay.innerHTML = `
      <div class="chat-container">
        <div class="chat-messages" id="chat-messages"></div>
        <form class="chat-input-form" id="chat-form">
          <input type="text" id="chat-input" class="form-control" placeholder="Type a message..." autocomplete="off">
          <button type="submit" class="btn btn-primary ms-2"><i class="bi bi-send-fill"></i></button>
        </form>
      </div>`;
    el.dataDisplay.className = '';
    document.getElementById('chat-form').addEventListener('submit', sendChatMessage);
    loadChatMessages();
  };

  function loadChatMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];

    if (messages.length === 0) {
      messagesContainer.innerHTML = `<div class="text-center text-muted p-5">No messages yet. Start the conversation!</div>`;
      return;
    }

    messagesContainer.innerHTML = messages.map((msg, idx) => {
      const isSent = msg.email === loggedInUser.email;
      const isAdmin = loggedInUser.userType === 'admin';
      const msgClass = isSent ? 'sent' : 'received';
      const userDisplay = isSent ? 'You' : msg.username;
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (msg.editing) {
        return `
          <div class="message ${msgClass}">
            <div class="meta">${userDisplay} <span class="fw-normal opacity-75 small">${time}</span></div>
            <form class="edit-chat-form d-inline-block w-100" data-idx="${idx}">
              <input type="text" class="form-control form-control-sm d-inline-block" value="${escapeHtml(msg.text)}" style="width:70%">
              <button type="submit" class="btn btn-success btn-sm ms-1">Save</button>
              <button type="button" class="btn btn-secondary btn-sm ms-1 cancel-edit-btn">Cancel</button>
            </form>
          </div>
        `;
      }

      return `
        <div class="message ${msgClass}">
          <div class="meta">${userDisplay} <span class="fw-normal opacity-75 small">${time}</span></div>
          <div class="text d-inline-block px-3 py-2 rounded ${isSent ? 'bg-primary text-white' : 'bg-light text-dark'}">${escapeHtml(msg.text)}</div>
          ${(isSent || isAdmin) ? `
            <button class="btn btn-link btn-sm text-warning edit-btn" data-idx="${idx}" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-link btn-sm text-danger delete-btn" data-idx="${idx}" title="Delete"><i class="bi bi-trash"></i></button>
          ` : ''}
        </div>
      `;
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        startEditChatMessage(parseInt(this.getAttribute('data-idx')));
      });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteChatMessage(parseInt(this.getAttribute('data-idx')));
      });
    });
    document.querySelectorAll('.edit-chat-form').forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const idx = parseInt(this.getAttribute('data-idx'));
        const newText = this.querySelector('input').value.trim();
        saveEditChatMessage(idx, newText);
      });
      form.querySelector('.cancel-edit-btn').addEventListener('click', function() {
        cancelEditChatMessage(parseInt(form.getAttribute('data-idx')));
      });
    });
  }

  const sendChatMessage = (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    if (input.value.trim()) {
      const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
      messages.push({
        username: loggedInUser.username,
        email: loggedInUser.email,
        text: input.value.trim(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      loadChatMessages();
      logActivity('chat', `Sent message: "${input.value.trim()}"`);
      input.value = '';
      input.focus();
    }
  };

  function startEditChatMessage(idx) {
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.forEach((msg, i) => msg.editing = (i === idx));
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    loadChatMessages();
  }

  function saveEditChatMessage(idx, newText) {
    if (!newText) return;
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const isAdmin = loggedInUser.userType === 'admin';
    if (messages[idx] && (messages[idx].email === loggedInUser.email || isAdmin)) {
      messages[idx].text = newText;
      delete messages[idx].editing;
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      loadChatMessages();
      logActivity('chat', `Edited message: "${newText}"`);
    }
  }

  function cancelEditChatMessage(idx) {
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    if (messages[idx]) delete messages[idx].editing;
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    loadChatMessages();
  }

  function deleteChatMessage(idx) {
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const isAdmin = loggedInUser.userType === 'admin';
    if (messages[idx] && (messages[idx].email === loggedInUser.email || isAdmin)) {
      const deletedText = messages[idx].text;
      messages.splice(idx, 1);
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      loadChatMessages();
      logActivity('chat', `Deleted message: "${deletedText}"`);
    }
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }

  // --- User Management Modal ---
  function renderUserTable(users, filter = "") {
    const userTableContainer = document.getElementById('userTableContainer');
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(filter) ||
      user.email.toLowerCase().includes(filter)
    );
    userTableContainer.innerHTML = `
      <table class="table table-hover">
        <thead><tr><th>Username</th><th>Email</th><th>User Type</th><th>Action</th></tr></thead>
        <tbody>
          ${filteredUsers.length
            ? filteredUsers.map(user => `
              <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                  <span class="badge ${user.userType === 'admin' ? 'bg-danger' : 'bg-secondary'}">
                    ${user.userType || 'regular'}
                  </span>
                </td>
                <td>
                  ${user.email !== loggedInUser.email
                    ? `<button class="btn btn-sm btn-primary start-chat-btn" data-email="${user.email}" data-username="${user.username}">Chat</button>`
                    : `<span class="text-muted">You</span>`
                  }
                </td>
              </tr>
            `).join('')
            : `<tr><td colspan="4" class="text-center text-muted">No users found.</td></tr>`
          }
        </tbody>
      </table>
    `;

    document.querySelectorAll('.start-chat-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const otherUser = {
          email: this.getAttribute('data-email'),
          username: this.getAttribute('data-username')
        };
        openPrivateChat(otherUser);
      });
    });
  }

  const renderUserManagement = async () => {
    try {
  
      const localUsers = JSON.parse(localStorage.getItem('users')) || [];
      const allUsers = localUsers;
      
      const modalBody = document.getElementById('userManagementModalBody');
      modalBody.innerHTML = `
        <input type="text" id="userSearchInput" class="form-control mb-3" placeholder="Search users by name or email...">
        <div id="userTableContainer"></div>
      `;
      renderUserTable(allUsers);

      document.getElementById('userSearchInput').addEventListener('input', function() {
        renderUserTable(allUsers, this.value.toLowerCase());
      });

      userManagementModal.show();
      renderGenericContent({name: "Settings"}, {name: "User Management", id: "user-management"});
    } catch (error) {
      console.error('Error loading users:', error);

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const modalBody = document.getElementById('userManagementModalBody');
      modalBody.innerHTML = `
        <input type="text" id="userSearchInput" class="form-control mb-3" placeholder="Search users by name or email...">
        <div id="userTableContainer"></div>
      `;
      renderUserTable(users);

      document.getElementById('userSearchInput').addEventListener('input', function() {
        renderUserTable(users, this.value.toLowerCase());
      });

      userManagementModal.show();
      renderGenericContent({name: "Settings"}, {name: "User Management", id: "user-management"});
    }
  };

  function openPrivateChat(otherUser) {
    el.dataDisplay.innerHTML = `
      <div class="private-chat-container">
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-person-circle fs-3 me-2"></i>
          <h5 class="mb-0">${otherUser.username} <span class="badge bg-secondary ms-2">Private Chat</span></h5>
        </div>
        <div class="private-chat-messages border rounded p-2 mb-2" id="private-chat-messages" style="height:250px;overflow-y:auto;background:#f8f9fa"></div>
        <form id="private-chat-form" class="d-flex">
          <input type="text" id="private-chat-input" class="form-control me-2" placeholder="Type a message..." autocomplete="off">
          <button type="submit" class="btn btn-primary"><i class="bi bi-send-fill"></i></button>
        </form>
        <button class="btn btn-link mt-2" id="back-to-users">&larr; Back to Users</button>
      </div>
    `;

    loadPrivateChatMessages(otherUser);

    document.getElementById('private-chat-form').addEventListener('submit', function(e) {
      e.preventDefault();
      sendPrivateChatMessage(otherUser);
    });

    document.getElementById('back-to-users').addEventListener('click', function() {
      renderUserManagement();
    });
  }

  function getChatKey(user1, user2) {
    return 'privateChat_' + [user1.email, user2.email].sort().join('_');
  }

  function loadPrivateChatMessages(otherUser) {
    const chatKey = getChatKey(loggedInUser, otherUser);
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    const messagesContainer = document.getElementById('private-chat-messages');
    if (!messages.length) {
      messagesContainer.innerHTML = `<div class="text-center text-muted p-3">No messages yet.</div>`;
      return;
    }
    messagesContainer.innerHTML = messages.map(msg => {
      const isSent = msg.email === loggedInUser.email;
      const msgClass = isSent ? 'sent text-end' : 'received text-start';
      const userDisplay = isSent ? 'You' : otherUser.username;
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="mb-2 ${msgClass}">
          <div class="small text-muted">${userDisplay} <span class="fw-normal opacity-75">${time}</span></div>
          <div class="d-inline-block px-3 py-2 rounded ${isSent ? 'bg-primary text-white' : 'bg-light text-dark'}">${msg.text}</div>
        </div>
      `;
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function sendPrivateChatMessage(otherUser) {
    const input = document.getElementById('private-chat-input');
    if (input.value.trim()) {
      const chatKey = getChatKey(loggedInUser, otherUser);
      const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
      messages.push({
        username: loggedInUser.username,
        email: loggedInUser.email,
        text: input.value.trim(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(chatKey, JSON.stringify(messages));
      loadPrivateChatMessages(otherUser);
      input.value = '';
      input.focus();
    }
  }

  // --- Generic Content ---
  const renderGenericContent = (module, sub) => {
    el.dataDisplay.innerHTML = `
      <h3>${sub.name}</h3>
      <p>Data for <strong>${module.name} → ${sub.name}</strong> will be displayed here.</p>
      <p class="text-muted">This is a placeholder for the ${sub.id} section.</p>
    `;
  };

  // --- Admin Functions ---
  const renderLoginHistory = async () => {
    try {
      // Load login history from localStorage only
      const localLoginHistory = JSON.parse(localStorage.getItem('loginRecords')) || [];
      const allLoginHistory = localLoginHistory;
      
      // Sort by login time (newest first)
      allLoginHistory.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));

      el.dataDisplay.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3>Login History</h3>
          <button class="btn btn-outline-primary btn-sm" onclick="exportLoginHistory()">
            <i class="bi bi-download"></i> Export
          </button>
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Login Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allLoginHistory.map(login => `
                <tr>
                  <td>${login.id}</td>
                  <td>${escapeHtml(login.username)}</td>
                  <td>${escapeHtml(login.email)}</td>
                  <td><span class="badge ${login.userType === 'admin' ? 'bg-danger' : 'bg-secondary'}">${login.userType}</span></td>
                  <td>${new Date(login.loginTime).toLocaleString()}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteLoginRecord(${login.id})">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="mt-3">
          <p class="text-muted">Total login records: ${allLoginHistory.length}</p>
        </div>
      `;
    } catch (error) {
      el.dataDisplay.innerHTML = `
        <div class="alert alert-danger">
          <h4>Error Loading Login History</h4>
          <p>${error.message}</p>
        </div>
      `;
    }
  };

  const renderUserExport = () => {
    const localUsers = JSON.parse(localStorage.getItem('signupRecords')) || [];
    
    el.dataDisplay.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>User Export</h3>
        <div>
          <button class="btn btn-success btn-sm me-2" onclick="exportNewUsers()">
            <i class="bi bi-download"></i> Export New Users
          </button>
          <button class="btn btn-outline-primary btn-sm" onclick="exportAllUsers()">
            <i class="bi bi-download"></i> Export All Users
          </button>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>New Users (Pending Export)</h5>
            </div>
            <div class="card-body">
              ${localUsers.length === 0 ? 
                '<p class="text-muted">No new users to export</p>' :
                `<p class="text-success">${localUsers.length} new user(s) ready for export</p>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>User Type</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${localUsers.map(user => `
                        <tr>
                          <td>${escapeHtml(user.username)}</td>
                          <td>${escapeHtml(user.email)}</td>
                          <td><span class="badge ${user.userType === 'admin' ? 'bg-danger' : 'bg-secondary'}">${user.userType}</span></td>
                          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>`
              }
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Export Instructions</h5>
            </div>
            <div class="card-body">
              <p><strong>Signup Records Export:</strong> Downloads all signup records as a JSON file</p>
              <p><strong>All Users Export:</strong> Downloads all registered users as a complete JSON file</p>
              <hr>
              <div class="alert alert-info">
                <small>
                  <strong>Note:</strong> Signup records are stored in localStorage and can be exported as JSON files.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderSystemLogs = () => {
    el.dataDisplay.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>System Logs</h3>
        <button class="btn btn-outline-primary btn-sm" onclick="exportSystemLogs()">
          <i class="bi bi-download"></i> Export Logs
        </button>
      </div>
      
      <div class="card">
        <div class="card-body">
          <h5>System Information</h5>
          <ul class="list-unstyled">
            <li><strong>Current User:</strong> ${loggedInUser.username} (${loggedInUser.userType})</li>
            <li><strong>Session Start:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>Browser:</strong> ${navigator.userAgent}</li>
            <li><strong>Local Storage:</strong> ${Object.keys(localStorage).length} items</li>
            <li><strong>Session Storage:</strong> ${Object.keys(sessionStorage).length} items</li>
          </ul>
          
          <hr>
          
          <h5>Recent Activities</h5>
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${new Date().toLocaleString()}</td>
                  <td>${loggedInUser.username}</td>
                  <td>Accessed System Admin panel</td>
                </tr>
                <tr>
                  <td>${new Date().toLocaleString()}</td>
                  <td>System</td>
                  <td>Login history loaded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  // --- Content Switcher ---
  const renderContent = (module, sub) => {
    el.mainContentHeader.textContent = `${module.name} → ${sub.name}`;
    el.dataDisplay.className = 'p-4';

    switch (sub.id) {
      case 'user-management':
        renderUserManagement();
        break;
      case 'general-chat':
        renderChatInterface();
        break;
      case 'All Activity':
        renderAllActivities();
        break;
      case 'Filter Activity':
        renderFilterActivity();
        break;
      case 'Mark as Read/Unread':
        renderMarkAsReadUnread();
        break;
      case 'activities-dash':
        renderAllActivities();
        break;
      case 'login-history':
        renderLoginHistory();
        break;
      case 'user-export':
        renderUserExport();
        break;
      case 'system-logs':
        renderSystemLogs();
        break;
      default:
        renderGenericContent(module, sub);
    }
  };

  // --- Event Listeners ---
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
  };

  const setupEventListeners = () => {
    el.logoutBtn.addEventListener('click', handleLogout);
    el.searchInput.addEventListener("input", (e) => renderIcons(e.target.value.toLowerCase()));

    let isExpanded = false;
    el.expandBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      el.subSidebar.classList.toggle('hide', isExpanded);
      el.dragHandle.classList.toggle('hide', isExpanded);
      el.mainContent.style.width = isExpanded ? "100%" : "auto";
      el.expandBtn.innerHTML = isExpanded ? `<i class="bi bi-arrows-collapse"></i>` : `<i class="bi bi-arrows-fullscreen"></i>`;
    });

    let isDragging = false;
    el.dragHandle.addEventListener("mousedown", () => {
      isDragging = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      let newWidth = e.clientX - el.miniSidebar.offsetWidth;
      if (newWidth < 150) newWidth = 150;
      if (newWidth > 500) newWidth = 500;
      el.subSidebar.style.width = `${newWidth}px`;
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    });

    window.addEventListener('storage', (event) => {
      // For group chat
      if (event.key === 'chatMessages' && document.querySelector('.chat-container')) {
        loadChatMessages();
      }
      // For private chat
      if (event.key && event.key.startsWith('privateChat_') && document.querySelector('.private-chat-container')) {
        const chatKey = event.key;
        const emails = chatKey.replace('privateChat_', '').split('_');
        const otherEmail = emails.find(email => email !== loggedInUser.email);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const otherUser = users.find(u => u.email === otherEmail);
        if (otherUser) loadPrivateChatMessages(otherUser);
      }
    });

    // --- Theme Toggle ---
    if (el.themeToggle) {
      el.themeToggle.addEventListener('click', () => {
        const body = document.body;
        if (body.classList.contains('light-theme')) {
          body.classList.remove('light-theme');
          body.classList.add('dark-theme');
          localStorage.setItem('theme', 'dark-theme');
          el.themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
          body.classList.remove('dark-theme');
          body.classList.add('light-theme');
          localStorage.setItem('theme', 'light-theme');
          el.themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        }
      });
    }
  };

  // --- Export Functions (Global Scope) ---
  window.exportLoginHistory = async () => {
    try {
      const localLoginHistory = JSON.parse(localStorage.getItem('loginRecords')) || [];
      
      const blob = new Blob([JSON.stringify({ loginRecords: localLoginHistory }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'login_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Login history exported successfully!', 'success');
    } catch (error) {
      showToast('Error exporting login history', 'danger');
    }
  };

  window.exportNewUsers = () => {
    try {
      const signupRecords = JSON.parse(localStorage.getItem('signupRecords')) || [];
      const blob = new Blob([JSON.stringify({ signupRecords: signupRecords }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signup_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Signup records exported successfully!', 'success');
    } catch (error) {
      showToast('Error exporting signup records', 'danger');
    }
  };

  window.exportAllUsers = async () => {
    try {
      const localUsers = JSON.parse(localStorage.getItem('users')) || [];
      
      const blob = new Blob([JSON.stringify({ users: localUsers }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all_users_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('All users exported successfully!', 'success');
    } catch (error) {
      showToast('Error exporting all users', 'danger');
    }
  };

  window.exportSystemLogs = () => {
    try {
      const systemInfo = {
        currentUser: loggedInUser,
        sessionStart: new Date().toISOString(),
        browser: navigator.userAgent,
        localStorage: Object.keys(localStorage).length,
        sessionStorage: Object.keys(sessionStorage).length,
        exportTime: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(systemInfo, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'system_logs_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('System logs exported successfully!', 'success');
    } catch (error) {
      showToast('Error exporting system logs', 'danger');
    }
  };

  window.deleteLoginRecord = (id) => {
    if (confirm('Are you sure you want to delete this login record?')) {
      const localLoginHistory = JSON.parse(localStorage.getItem('loginRecords')) || [];
      const filteredHistory = localLoginHistory.filter(record => record.id !== id);
      localStorage.setItem('loginRecords', JSON.stringify(filteredHistory));
      
      showToast('Login record deleted successfully!', 'success');
      renderLoginHistory(); // Refresh the display
    }
  };

  // --- INIT ---
  const init = () => {
    el.userName.textContent = loggedInUser.username;
    renderIcons();
    setupEventListeners();
    if (el.miniSidebar.firstChild) el.miniSidebar.firstChild.click();

    // Theme on load
    if (el.themeToggle) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(savedTheme);
        el.themeToggle.innerHTML = savedTheme === 'dark-theme' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
      } else {
        document.body.classList.add('light-theme');
        el.themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      }
    }

    if (sessionStorage.getItem('login_success')) {
      showToast(`Welcome back, ${loggedInUser.username}!`);
      sessionStorage.removeItem('login_success');
    }
  };

  init();
});