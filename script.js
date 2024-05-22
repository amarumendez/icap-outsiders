fetch('profile.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }
    return response.json();
  })
  .then(data => {
    // Update profile info
    updateProfileInfo(data.profile);
    // Update follower count
    followButton.addEventListener("click", () => { followUser(data.profile); });

    // Update posts
    data.posts.forEach(post => {
      const postElement = createPostElement(post);
      document.querySelector('main').appendChild(postElement);
    });
  })
  .catch(error => console.error('Error fetching profile data:', error));

// Function to update profile info
function updateProfileInfo(profile) {
  document.getElementById('username').textContent = `@${profile.username}`;
  document.getElementById('bio').textContent = profile.bio;
  document.getElementById('posts').textContent = `Posts: ${profile.posts}`;
  document.getElementById('followers').textContent = `Followers: ${profile.followers}`;
  document.getElementById('following').textContent = `Following: ${profile.following}`;
  document.querySelector('.user-info-container .profile-picture-container img').src = profile.pfp_url;
}

// Function to create post element
function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.classList.add('post');

  const img = document.createElement('img');
  img.src = post.post_url;
  img.alt = post.post_alt;

  // Like container
  const likeContainer = document.createElement('div');
  likeContainer.classList.add('like-container');

  const likeImg = document.createElement('img');
  likeImg.src = "empty-heart.png";
  likeImg.alt = "Like button";
  likeImg.classList.add('like-button');

  const likeCount = document.createElement('span');
  likeCount.classList.add('like-count');
  likeCount.textContent = post.likes;

  likeImg.addEventListener('click', () => {
    if (likeImg.src.includes("empty-heart.png")) {
      likeImg.src = "heart-filled.png";
      likeCount.textContent = ++post.likes;
    } else {
      likeImg.src = "empty-heart.png";
      likeCount.textContent = --post.likes;
    }
  });

  likeContainer.appendChild(likeImg);
  likeContainer.appendChild(likeCount);

  postDiv.appendChild(img);
  postDiv.appendChild(likeContainer);

  // Click event for opening the overlay
  img.addEventListener('click', () => openOverlay(post));

  return postDiv;
}

// Function to open overlay
function openOverlay(post) {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex';

  document.getElementById('overlay-img').src = post.post_url;
  document.getElementById('overlay-like-img').src = post.likes > 0 ? "heart-filled.png" : "empty-heart.png";
  document.getElementById('overlay-like-count').textContent = post.likes;
  document.getElementById('overlay-description').textContent = post.post_alt;
  document.getElementById('overlay-date').textContent = `Date: ${post.post_date || ""}`;

  // Update comments
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = "";
  if (post.comments && post.comments.length > 0) {
    post.comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.textContent = comment;
      commentsList.appendChild(commentElement);
    });
  } else {
    commentsList.textContent = "No comments here...";
  }
}

// Event listener for close overlay button
document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('overlay').style.display = "none";
});

// Event listener for submit comment button
document.getElementById('submit-comment-btn').addEventListener('click', () => {
  const commentInput = document.getElementById('comment-input');
  const comment = commentInput.value.trim();
  if (comment) {
    const commentElement = document.createElement('div');
    commentElement.textContent = comment;
    document.getElementById('comments-list').appendChild(commentElement);
    commentInput.value = "";
  }
});

// Add followers
const followButton = document.getElementById("follow-btn");
let isFollowing = false;

function followUser(profileData) {
  const followersDiv = document.getElementById('followers');
  const followButton = document.getElementById('follow-btn');

  if (profileData) {
    if (!isFollowing) {
      // Increase followers count
      profileData.followers++;
      followersDiv.textContent = `Followers: ${profileData.followers}`;
      followButton.textContent = "Following";
      isFollowing = true;
    } else {
      // Decrease followers count
      profileData.followers--;
      followersDiv.textContent = `Followers: ${profileData.followers}`;
      followButton.textContent = "Follow";
      isFollowing = false;
    }
  } else {
    console.error("Profile data is not available.");
  }
}

// Event listener for message button
document.getElementById('messages-btn').addEventListener('click', () => {
  const recipient = "ponyboy_curtis"; // Set recipient here
  openMessageOverlay(recipient);
});

// Open message overlay
function openMessageOverlay(recipient) {
  const messageHeaderText = document.getElementById('message-header-text');
  messageHeaderText.textContent = `Messaging to: ${recipient}`;
  document.getElementById('message-overlay').style.display = 'block';
}

// Close message overlay
document.getElementById('close-message-overlay-btn').addEventListener('click', () => {
  document.getElementById('message-overlay').style.display = 'none';
});

// Submit message
document.getElementById('submit-message-btn').addEventListener('click', () => {
  const messageInput = document.getElementById('message-input');
  const messageText = messageInput.value.trim();
  if (messageText) {
    const messageContainer = document.getElementById('message-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    // Add message text
    const messageTextDiv = document.createElement('div');
    messageTextDiv.textContent = messageText;
    messageTextDiv.classList.add('message-text');
    messageDiv.appendChild(messageTextDiv);

    // Add timestamp
    const timestampSpan = document.createElement('span');
    const currentDate = new Date();
    const timestamp = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
    timestampSpan.textContent = timestamp;
    timestampSpan.classList.add('message-timestamp');
    messageDiv.appendChild(timestampSpan);

    messageContainer.appendChild(messageDiv);
    messageInput.value = '';
  }
});
