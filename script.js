// Switches navBar
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Remove active class from all sections
            sections.forEach(section => section.classList.remove('active'));

            // Add active class to the target section
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Call setupNavigation on page load to set up the links
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadPosts();  // Load posts when we click on navbar: feed
    loadFriends();  // Load friends list we click on navbar: amis
});


// Sample JSON data to simulate an API response
const postsData = [
    {
        id: 1,
        content: "This is a sample post with text only.",
        image: null,
        reactions: { like: 0, dislike: 0, love: 0 },
    },
    {
        id: 2,
        content: "Here is a post with an image.",
        image: "images/kinkakuji-kioto.jpg",
        reactions: { like: 0, dislike: 0, love: 0 },
    },
    {
        id: 3,
        content: "Here is another post with an image of Japan.",
        image: "images/miyajima.jpg",
        reactions: { like: 0, dislike: 0, love: 0 },
    }
];

// Function to load posts from JSON and render them
function loadPosts() {
    const feedContainer = document.querySelector('.feed-container');
    postsData.forEach(post => {
        const postElement = createPostElement(post);
        feedContainer.appendChild(postElement);
    });
}

// Function to create post elements dynamically
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-content';
    contentDiv.textContent = post.content;
    postDiv.appendChild(contentDiv);

    // Add image if post has one
    if (post.image) {
        const imageElement = document.createElement('img');
        imageElement.src = post.image;
        imageElement.className = 'post-image';
        imageElement.alt = 'Post image';
        imageElement.addEventListener('click', () => viewImageFullScreen(post.image));
        postDiv.appendChild(imageElement);
    }

    // Create reaction buttons
    const reactionsDiv = document.createElement('div');
    reactionsDiv.className = 'post-reactions';
    ['like', 'dislike', 'love'].forEach(reactionType => {
        const button = document.createElement('button');
        button.className = `reaction ${reactionType}`;
        button.textContent = `${capitalize(reactionType)} (${post.reactions[reactionType]})`;
        button.addEventListener('click', () => handleReaction(post, reactionType, button));
        reactionsDiv.appendChild(button);
    });
    postDiv.appendChild(reactionsDiv);

    // Create comment section
    const commentSection = document.createElement('div');
    commentSection.className = 'comment-section';

    // Display existing comments if any
    const commentsList = document.createElement('div');
    commentsList.className = 'comments-list';
    post.comments?.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
    commentSection.appendChild(commentsList);

    // Input field for new comments
    const commentInput = document.createElement('input');
    commentInput.className = 'comment-input';
    commentInput.type = 'text';
    commentInput.placeholder = 'Ajouter un commentaire...';
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && commentInput.value.trim()) {
            const newComment = { text: commentInput.value.trim(), replies: [] };
            post.comments = post.comments || [];
            post.comments.push(newComment);

            const commentElement = createCommentElement(newComment);
            commentsList.appendChild(commentElement);
            commentInput.value = '';
        }
    });

    commentSection.appendChild(commentInput);
    postDiv.appendChild(commentSection);

    return postDiv;
}

function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    const commentText = document.createElement('p');
    commentText.className = 'comment-text';
    commentText.textContent = comment.text;
    commentDiv.appendChild(commentText);

    // Reply button
    const replyButton = document.createElement('button');
    replyButton.className = 'reply-button';
    replyButton.textContent = 'Répondre';
    commentDiv.appendChild(replyButton);

    // Reply input (hidden by default)
    const replyInput = document.createElement('input');
    replyInput.className = 'reply-input hidden';
    replyInput.type = 'text';
    replyInput.placeholder = 'Ajouter une réponse...';
    replyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && replyInput.value.trim()) {
            const newReply = { text: replyInput.value.trim() };
            comment.replies = comment.replies || [];
            comment.replies.push(newReply);

            const replyElement = createCommentElement(newReply);
            repliesList.appendChild(replyElement);
            replyInput.value = '';
            replyInput.classList.add('hidden'); // Hide the reply input after adding a reply
        }
    });
    commentDiv.appendChild(replyInput);

    // Toggle reply input on button click
    replyButton.addEventListener('click', () => {
        replyInput.classList.toggle('hidden');
        replyInput.focus();
    });

    // Replies list
    const repliesList = document.createElement('div');
    repliesList.className = 'replies-list';
    comment.replies?.forEach(reply => {
        const replyElement = createCommentElement(reply);
        repliesList.appendChild(replyElement);
    });
    commentDiv.appendChild(repliesList);

    return commentDiv;
}


// Function to handle reactions to a post
function handleReaction(post, reactionType, button) {
    // Increase reaction count in the JSON data
    post.reactions[reactionType]++;
    // Update button text to show new reaction count
    button.textContent = `${capitalize(reactionType)} (${post.reactions[reactionType]})`;
    // Call animation function
    animateReaction(button);
}

// Function to animate a reaction button with particle effects
function animateReaction(button) {
    button.style.transform = 'scale(1.2)';
    setTimeout(() => button.style.transform = 'scale(1)', 200);
}

// Utility function to capitalize the first letter of a string
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Function to view the post image in full screen
function viewImageFullScreen(imageSrc) {
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    const fullScreenImage = document.createElement('img');
    fullScreenImage.src = imageSrc;
    fullScreenImage.className = 'full-screen-image';

    overlay.appendChild(fullScreenImage);
    document.body.appendChild(overlay);

    // Close full-screen view on click
    overlay.addEventListener('click', () => document.body.removeChild(overlay));
}

// Friends list
const friendsData = [
    { name: "Alice Dupont" },
    { name: "Jean Martin" },
    { name: "Marie Curie" },
    { name: "Pierre Lafont" }
];

// Load friends into the friend list
function loadFriends() {
    const friendList = document.getElementById('friend-list');
    friendsData.forEach(friend => {
        const friendItem = document.createElement('li');
        friendItem.className = 'friend-item';
        friendItem.textContent = friend.name;

        // Link to messaging page
        const messageLink = document.createElement('a');
        messageLink.href = '#messagerie';
        messageLink.className = 'friend-link';
        messageLink.textContent = 'Message';
        friendItem.appendChild(messageLink);

        friendList.appendChild(friendItem);

        // Enable drag-and-drop functionality
        friendItem.draggable = true;
        friendItem.addEventListener('dragstart', handleDragStart);
        friendItem.addEventListener('dragover', handleDragOver);
        friendItem.addEventListener('drop', handleDrop);
    });
}

// Filter friends by search input
function filterFriends() {
    const searchValue = document.getElementById('friend-search').value.toLowerCase();
    document.querySelectorAll('.friend-item').forEach(friend => {
        friend.style.display = friend.textContent.toLowerCase().includes(searchValue) ? 'flex' : 'none';
    });
}

// Drag-and-drop functions
let draggedFriend = null;

function handleDragStart(event) {
    draggedFriend = event.target;
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    if (draggedFriend !== this) {
        const friendList = document.getElementById('friend-list');
        friendList.insertBefore(draggedFriend, this);
    }
}