const PostFeed = ({ posts }) => {
    return (
      <div className="post-feed">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <div className="post-content">
              {post.text && <p>{post.text}</p>}
              {post.img && <img src={post.img} alt="Post Image" />}
              {post.video && (
                <video controls>
                  <source src={post.video} />
                </video>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default PostFeed;
  