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
    loadConversations() // Load conversation when we click on navbar: messagerie
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

// Sample data to simulate an API response for conversations
const conversationsData = [
    {
        id: 1,
        name: "Alice Dupont",
        profileImage: "images/alice.jpg",
        messages: [
            { sender: "Alice", content: "Salut! Comment ça va?", timestamp: "10:30" },
            { sender: "Véronica", content: "Très bien, et toi?", timestamp: "10:32" }
        ]
    },
    {
        id: 2,
        name: "Jean Martin",
        profileImage: "images/jean.jpg",
        messages: [
            { sender: "Jean", content: "Prêt pour la réunion?", timestamp: "11:00" },
            { sender: "Véronica", content: "Oui, à bientôt!", timestamp: "11:02" }
        ]
    },
    {
        id: 3,
        name: "Marie Curie",
        profileImage: "images/avatar.jpg",
        messages: [
            { sender: "Marie", content: "Bonjour Véronica, as-tu eu le temps de revoir les notes de notre dernière réunion?", timestamp: "09:00" },
            { sender: "Véronica", content: "Salut Marie, oui, j'ai parcouru toutes les notes. Il y a des points intéressants à approfondir.", timestamp: "09:05" },
            { sender: "Marie", content: "Parfait! J'aimerais qu'on se concentre sur la partie de l'expérience initiale.", timestamp: "09:10" },
            { sender: "Véronica", content: "Je suis d'accord. Je pense que cela pourrait vraiment améliorer nos résultats.", timestamp: "09:12" },
            { sender: "Marie", content: "Est-ce que tu as eu des idées pour les tests que nous pourrions faire?", timestamp: "09:15" },
            { sender: "Véronica", content: "Oui, j'ai pensé à quelques variations que l'on pourrait essayer. Je te montrerai mes idées lors de notre prochaine réunion.", timestamp: "09:18" },
            { sender: "Marie", content: "Ça me semble bien. Merci pour ton travail, Véronica!", timestamp: "09:20" },
            { sender: "Véronica", content: "Avec plaisir, Marie! C'est toujours un plaisir de travailler sur ces projets avec toi.", timestamp: "09:22" },
            { sender: "Marie", content: "À très bientôt alors!", timestamp: "09:23" }
        ]
    }
];

// Display the list of conversations
function loadConversations() {
    const conversationsContainer = document.querySelector('.conversations-container');
    conversationsContainer.innerHTML = '';  // Clear previous content
    conversationsData.forEach(conversation => {
        const conversationElement = document.createElement('div');
        conversationElement.className = 'conversation';
        conversationElement.id = `conversation-${conversation.id}`;

        // Profile image
        const profileImage = document.createElement('img');
        profileImage.src = conversation.profileImage;
        profileImage.className = 'conversation-profile-pic';

        // Name and last message
        const details = document.createElement('div');
        details.className = 'conversation-details';
        details.innerHTML = `<strong>${conversation.name}</strong><br><span>${getLastMessage(conversation).content}</span>`;

        conversationElement.appendChild(profileImage);
        conversationElement.appendChild(details);

        // Show message history on click
        conversationElement.addEventListener('click', () => {
            // Remove active class from other conversations
            document.querySelectorAll('.conversation').forEach(conv => conv.classList.remove('active-conversation'));
            // Add active class to selected conversation
            conversationElement.classList.add('active-conversation');
            loadConversationHistory(conversation);
        });

        conversationsContainer.appendChild(conversationElement);
    });
}


// Get the last message of a conversation
function getLastMessage(conversation) {
    return conversation.messages[conversation.messages.length - 1];
}

// Load the full conversation history
function loadConversationHistory(conversation) {
    const messageDetails = document.querySelector('.message-details');
    messageDetails.innerHTML = '';

    conversation.messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${msg.sender === 'Véronica' ? 'outgoing' : 'incoming'}`;
        messageDetails.style.display = 'block';

        // Profile image, name, timestamp, and content
        if (msg.sender !== 'Véronica') {
            const profileImage = document.createElement('img');
            profileImage.src = conversation.profileImage;
            profileImage.className = 'message-profile-pic';
            messageElement.appendChild(profileImage);
        }

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${msg.content}</p><span>${msg.timestamp}</span>`;
        
        messageElement.appendChild(messageContent);
        messageDetails.appendChild(messageElement);
    });

    // Add a field for new message input
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Écrire un message...';
    inputField.className = 'message-input';
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && inputField.value.trim()) {
            sendMessage(conversation, inputField.value.trim());
            inputField.value = '';
        }
    });
    
    messageDetails.appendChild(inputField);
}

// Send a new message and update JSON and UI
function sendMessage(conversation, content) {
    const newMessage = { sender: "Véronica", content: content, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) };
    conversation.messages.push(newMessage);
    
    loadConversationHistory(conversation);  // Refresh to display the new message
}



// Friends Section
const friendsData = [
    { name: "Alice Dupont", profileImage: "images/alice.jpg" },
    { name: "Jean Martin", profileImage: "images/jean.jpg" },
    { name: "Marie Curie", profileImage: "images/avatar.jpg" },
    { name: "Pierre Lafont", profileImage: "images/default.jpg" }
];

// Load friends into the friend list
function loadFriends() {
    const friendList = document.getElementById('friend-list');
    friendsData.forEach(friend => {
        const friendItem = document.createElement('li');
        friendItem.className = 'friend-item';

        // Create profile image element
        const profileImage = document.createElement('img');
        profileImage.src = friend.profileImage ? friend.profileImage : 'images/default.jpg';
        profileImage.className = 'friend-profile-pic';

        // Friend name and message link
        const friendDetails = document.createElement('div');
        friendDetails.className = 'friend-details';
        friendDetails.textContent = friend.name;

        // Link to messaging page
        const messageLink = document.createElement('a');
        messageLink.href = '#';
        messageLink.className = 'friend-link';
        messageLink.textContent = 'Message';

        // Event to load the messaging section and open the conversation
        messageLink.addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelector('#messagerie').classList.add('active');
            document.querySelector('#amis').classList.remove('active');
            loadConversationByName(friend.name);
        });

        friendItem.appendChild(profileImage); 
        friendItem.appendChild(friendDetails);
        friendItem.appendChild(messageLink);
        friendList.appendChild(friendItem);

        // Enable drag-and-drop functionality
        friendItem.draggable = true;
        friendItem.addEventListener('dragstart', handleDragStart);
        friendItem.addEventListener('dragover', handleDragOver);
        friendItem.addEventListener('drop', handleDrop);
    });
}

// Load conversation by friend name, show invitation message if no conversation exists
function loadConversationByName(name) {
    const messageDetails = document.querySelector('.message-details');
    const conversation = conversationsData.find(conv => conv.name === name);
    
    if (conversation) {
        // If conversation exists, load the conversation history
        loadConversationHistory(conversation);
    } else {
        // If no conversation exists, show invitation message
        messageDetails.style.display = 'block';
        messageDetails.innerHTML = `<p>Tu n'as pas de conversation avec ${name}. Envoie-lui un message!</p>`;
        
        // Option to start a new conversation
        const startMessageButton = document.createElement('button');
        startMessageButton.textContent = `Envoyer un message à ${name}`;
        startMessageButton.className = 'start-message-button';
        startMessageButton.addEventListener('click', () => {
            startNewConversation(name);
        });
        
        messageDetails.appendChild(startMessageButton);
    }
}

// Function to start a new conversation with a friend
function startNewConversation(name) {
    const newConversation = {
        id: conversationsData.length + 1,
        name: name,
        profileImage: "images/default.jpg",
        messages: []
    };
    conversationsData.push(newConversation); // Add to conversationsData
    loadConversationHistory(newConversation); // Load the new, empty conversation
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
    draggedFriend.classList.add('dragging');
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
    draggedFriend.classList.remove('dragging');
}