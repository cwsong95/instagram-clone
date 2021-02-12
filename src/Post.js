import React, { useState, useEffect } from 'react';
import classes from './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';
import { BsHeart, BsChat, BsBookmark } from "react-icons/bs";
import { FaRegPaperPlane } from "react-icons/fa";

function Post({ postId, user, username, caption, imageUrl, location, time }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db.collection("posts")
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
      });

    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }

  return (
    <div className={classes.post}>
      <div className={classes.post__header}>
        <Avatar
          style={{
            width: '27px',
            height: '27px',
            marginLeft: '5px'
          }}
          className={classes.post__avatar}
          alt={username}
          src="/static/images/avatart/a.jpg"
          />
        <div className={classes.post__header_container}>
          <h3 className={classes.post__header_username}>{username}</h3>
          <p className={classes.post__header_location}>{location}</p>
        </div>
      </div>
      
      {/* header -> avator + username */}

      <img className={classes.post__image} src={imageUrl} alt="" />
      <div className={classes.post__iconContainer}>
        <div className={classes.post__iconsRight}>
          <BsHeart className={classes.header__icon} />
          <BsChat className={classes.header__icon} />
          <FaRegPaperPlane className={classes.header__icon} />
        </div>
         <BsBookmark className={classes.header__icon} />
      </div>
      <h4 className={classes.post__text}><b className={classes.comment__username}>{username}</b> {caption}</h4>
    
      <div className={classes.post__comments}>
        {comments.map((comment) => (
          <div className={classes.comment__container}>
            <p className={classes.comment}>
              <b className={classes.comment__username}>{comment.username}</b> {comment.text}
            </p> 
            <BsHeart className={classes.like__icon} />
          </div>
        ))}
      </div>

      {time}

      
      <form className={classes.post__commentBox}>
        <input
          className={classes.post__input}
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          />
        <button className={classes.post__button} disabled={!comment} type="submit" onClick={postComment}>
          Post
        </button>
      </form>
    </div>
  )
}

export default Post
