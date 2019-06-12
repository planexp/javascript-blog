'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagcloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-authorlist-link').innerHTML)
}

const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optArticleTagsSelector = '.post-tags .list';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';
const optTagsListSelector = '.tags.list';
const optArticleAuthorSelector = '.post-author';
const optAuthorsListSelector = '.authors.list';


function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');


  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  console.log('clickedElement:', clickedElement);

  clickedElement.classList.add('active');


  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
}


function generateTitleLinks(customSelector = '') {
  console.log('Title links have been generated');
  console.log(customSelector);

  /* remove contents of titlelist */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(optArticleSelector + customSelector);

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);

    /* find the title element */
    /* get the title from the title element */
    console.log(article.querySelector(optTitleSelector));

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    console.log(articleTitle);

    /* create HTML of the link */
    const linkHTMLData = {
      id: articleId,
      title: articleTitle
    };
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

    /* insert link into titleList*/

    html = html + linkHTML;
    console.log(html);

  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);


  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

// call function

generateTitleLinks();



function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  }

  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else params.max;

    if (tags[tag] < params.min) {
      params.min = tags[tag];
    } else params.min;
  }
  return params;
}



function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber
}


function generateTags() {
  console.log('Tags have been generated');

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);
  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    console.log(tagsWrapper);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {

      /* generate HTML of the link */


      const linkHTMLData = {
        id: tag
      };
      const linkHTML = templates.tagLink(linkHTMLData);


      /* add generated code to html variable */
      html = html + linkHTML

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */

    tagsWrapper.innerHTML = html

    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {
    tags: []
  };

  /* [NEW] START LOOP: for each tag in allTags */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

    /* [NEW] END LOOP: for each tag in allTags */

    /* [NEW] add html from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);
  }
}

generateTags();


function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  /* alternative way? : const tag = href.str.substr(6); */
  const tag = href.replace('#tag-', '');
  console.log(tag);

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(activeTagLinks);

  /* START LOOP: for each active tag link */

  for (let activeTagLink of activeTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {

    /* add class active */
    tagLink.classList.add('active');

    /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {

  /* find all links to tags */
  const tagsLinks = document.querySelectorAll('a[href^="#tag-"]'); // argument ??

  /* START LOOP: for each link */
  for (let tagLink of tagsLinks) {

    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToTags();


function generateAuthors() {
  console.log('Authors have been generated');

  /* [NEW] create a new variable allTAuthors with an empty object */
  let allAuthors = {};

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);
  console.log(articles);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    /* make html variable with empty string */
    let html = '';

    /* find the author*/
    const author = article.getAttribute('data-author');

    let authorLink = '<a href="#author-' + author + '">' + author + '</a>'

    const linkHTMLData = {
      id: author
    };
    const linkHTML = templates.authorLink(linkHTMLData);

    /* add generated code to html variable */
    html = html + linkHTML

    /* [NEW] check if this link is NOT already in allAuthors */
    if (!allAuthors.hasOwnProperty(author)) {
      /* [NEW] add generated code to allTags array */
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }

    /* insert HTML of the author into the author wrapper */
    authorWrapper.innerHTML = html;
  }

  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(optAuthorsListSelector);

  /* [NEW] create variable for all links HTML code */
  const allAuthorsData = {
    tags: []
  };

  /* [NEW] START LOOP: for each author in allAuthors */
  for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allAuthorsHTML */

    allAuthorsData.tags.push({
      author: author,
      count: allAuthors[author],
    });
    /* [NEW] END LOOP: for each tag in allTags */

    /* [NEW] add html from allTagsHTML to tagList */
    authorList.innerHTML = templates.authorListLink(allAuthorsData);
  }
}

generateAuthors();


function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  /* alternative way? : const tag = href.str.substr(6); */
  const tagAuthor = href.replace('#author-', '');
  console.log(tagAuthor);

  /* find all tag links with class active */

  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(activeAuthorLinks);

  /* START LOOP: for each active author link */

  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const authorLinks = document.querySelectorAll('a[href="#author-' + tagAuthor + '"]');

  /* START LOOP: for each found tag link */
  for (let authorLink of authorLinks) {

    /* add class active */
    authorLink.classList.add('active');

    /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + tagAuthor + '"]');
}


function addClickListenersToAuthors() {

  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]'); // argument ??

  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {

    /* add tagClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
