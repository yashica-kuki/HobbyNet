// Controllers/dashboardController.js
const prisma = require("../db");

const getDashboardData = async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        communities: true, // Specific groups joined
        hobbies: true,     // Broad interests
        _count: { select: { posts: true, followedBy: true } }
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // 1. Get IDs of joined communities
    const communityIds = user.communities.map(c => c.id);
    const hobbyIds = user.hobbies.map(h => h.id);

    // 2. Feed: Posts from joined Communities
    const posts = await prisma.post.findMany({
      where: { communityId: { in: communityIds } },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, avatar: true } },
        community: { select: { name: true, colorHex: true, iconName: true } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: userId } }
      }
    });

    // 3. Discover: Suggest Communities that belong to my Hobbies
    // BUT exclude communities I'm already in.
    const suggestedCommunities = await prisma.community.findMany({
      where: {
        hobbyId: { in: hobbyIds }, // Match my interests
        id: { notIn: communityIds } // Don't show what I already joined
      },
      take: 5
    });

    // 4. Trending Communities (Most members)
    const trendingCommunities = await prisma.community.findMany({
      orderBy: { members: { _count: 'desc' } },
      take: 3,
      select: { name: true, _count: { select: { members: true, posts: true } } }
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar || "JD",
        stats: {
          communities: user.communities.length,
          posts: user._count.posts,
          followers: user._count.followedBy
        }
      },
      myCommunities: user.communities, 
      feed: posts.map(p => ({
        id: p.id,
        author: p.author.name,
        avatar: p.author.avatar || "U",
        community: p.community.name,
        communityColor: p.community.colorHex || "#ccc",
        icon: p.community.iconName || "Hash",
        time: new Date(p.createdAt).toLocaleDateString(),
        title: p.title,
        content: p.content,
        likes: p._count.likes,
        comments: p._count.comments,
        isLiked: p.likes.length > 0
      })),
      trending: trendingCommunities.map(t => ({ name: t.name, count: t._count.posts })),
      discover: suggestedCommunities
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, communityId, userId } = req.body;
    await prisma.post.create({
      data: {
        title, content,
        authorId: parseInt(userId),
        communityId: parseInt(communityId)
      }
    });
    res.json({ message: "Post created" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

const joinCommunity = async (req, res) => {
    try {
        const { userId, communityId } = req.body;
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { communities: { connect: { id: parseInt(communityId) } } }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to join" });
    }
}

// NOTE: toggleLike is same as before, ensure it's exported
const toggleLike = async (req, res) => { /* same as before */ };

module.exports = { getDashboardData, createPost, joinCommunity, toggleLike };