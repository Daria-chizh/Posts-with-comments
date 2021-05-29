import { ajax } from 'rxjs/ajax';
import { mergeMap, pluck, filter } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

import formatDate from './dates';

const POSTS_URL = () => 'https://posts-with-comments.herokuapp.com/posts/latest';
const COMMENTS_URL = (postId) => `https://posts-with-comments.herokuapp.com/posts/${postId}/comments/latest`;

const feed = document.getElementById('feed');

/*
 * Create element and append it into specified parent node
 */
const createElement = (parent, tag, className) => {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  parent.appendChild(element);
  return element;
};

/*
 * Render content of post
 */
const renderPostContent = (container, post) => {
  const postContent = createElement(container, 'div', 'postContent');

  // avatar
  const avatarContainer = createElement(postContent, 'div', 'avatarContainer');
  const avatarImage = createElement(avatarContainer, 'img', 'avatarImage');
  avatarImage.setAttribute('src', post.avatar);

  // author and date
  const postMeta = createElement(postContent, 'div', 'postMeta');
  const author = createElement(postMeta, 'div', 'author');
  const postTime = createElement(postMeta, 'div', 'postDatetime');
  author.textContent = post.author;
  postTime.textContent = formatDate(post.created);

  // poster
  const posterContainer = createElement(postContent, 'div', 'posterContainer');
  const poster = createElement(posterContainer, 'img', 'poster');
  poster.setAttribute('src', post.image);
};

/*
 * Render post comment
 */
const renderPostComment = (container, comment) => {
  const {
    author, avatar, content, created,
  } = comment;

  const commentElement = createElement(container, 'div');

  // avatar
  const commentsAvatarContainer = createElement(commentElement, 'div', 'commentsAvatarContainer');
  const avatarImage = createElement(commentsAvatarContainer, 'img', 'avatarImage');
  avatarImage.setAttribute('src', avatar);

  // content
  const commentContent = createElement(commentElement, 'div', 'commentContent');
  const commentAuthor = createElement(commentContent, 'div', 'commentAuthor');
  const commentTime = createElement(commentContent, 'span', 'commentDatetime');
  const commentText = createElement(commentContent, 'div', 'commentText');
  commentAuthor.textContent = author;
  commentTime.textContent = formatDate(created);
  commentText.textContent = content;
};

/*
 * Process single post
 */
const handleResponse = (res) => {
  const post = createElement(feed, 'div', 'post');

  // post content
  renderPostContent(post, res);

  // 'Latest comments' title
  const commentsSectionsTitle = createElement(post, 'div', 'commentsSectionTitle');
  commentsSectionsTitle.textContent = 'Latest comments';

  // comments
  const comments = createElement(post, 'div');
  for (const comment of res.comments) {
    renderPostComment(comments, comment);
  }
};

const handleError = (err) => {
  console.error(err);
};

ajax.getJSON(POSTS_URL())
  .pipe(
    pluck('data'),
    mergeMap((data) => data),
    mergeMap((val) => combineLatest(
      of(val),
      ajax.getJSON(COMMENTS_URL(val.id)).pipe(filter(({ status }) => status === 'ok'), pluck('data')),
      (post, comments) => ({ ...post, comments }),
    )),
  )
  .subscribe(handleResponse, handleError);
