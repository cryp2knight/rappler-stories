import { useEffect, useState } from "react";


function ProgressLine({ active }) {
  return (
    <span className={`mr-1 rounded-lg w-full ${active ? 'bg-gray-400' : 'bg-white'}`}
      style={{ height: '2px' }}>
    </span>
  )
}

function ProgressLines({ posts, currentStory }) {
  return (
    <div className="flex flex-row justify-between md:my-5 mt-2">
      {posts.map((post, i) => (
        <ProgressLine key={i} active={currentStory <= i - 1} />
      ))}
    </div>
  )
}

function RapplerAvatar() {
  return (
    <img src="rappler.jpg" className="rounded-full" />
  )
}


function ProfileHeader({ setShowStories }) {
  function handleClick() {
    setShowStories(false)
  }

  return (
    <div className="flex mt-2 md:mt-5 md:mx-0 mx-2 justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10">
          <RapplerAvatar />
        </div>
        <span className="text-white text-lg mx-2">Rappler</span>
      </div>
      <button className="text-4xl text-white" onClick={handleClick}>&times;</button>
    </div>
  )
}

function Header({ posts, currentStory, setShowStories }) {
  return (
    <div className="w-full max-w-md fixed top-0 md:bg-gray-900">
      <ProfileHeader setShowStories={setShowStories} />
      <ProgressLines posts={posts} currentStory={currentStory} />
    </div>
  )
}

function LeftRightSections({ currentStory, setCurrentStory, totalPosts, setShowStories }) {

  function left() {
    if (currentStory > 0)
      setCurrentStory(currentStory - 1)
  }
  function right() {
    if (currentStory < totalPosts - 1)
      setCurrentStory(currentStory + 1)
    else if (currentStory === totalPosts - 1)
      setShowStories(false)
  }

  useEffect(() => {
    const interval = setInterval(() => right(), 3000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className="flex h-screen w-full max-w-md fixed top-0">
      <div className="w-1/2 mr-5 flex items-center" onClick={left}>
        <button className="bg-white -ml-16 w-10 text-center 
          h-10 rounded-full text-4xl hidden md:block">
          ‹
        </button>
      </div>
      <div className="w-1/2 ml-5 flex items-center justify-end" onClick={right}>
        <button className="bg-white -mr-16 w-10 text-center 
          h-10 rounded-full text-4xl hidden md:block">
          ›
        </button>
      </div>
    </div>
  )
}

function Title({ title }) {
  return (
    <span className="p-3 text-2xl tracking-wide 
    font-bold text-white w-3/4 text-center">
      {title}
    </span>
  )
}


function RapplerLink({ data }) {
  function url() {
    let link = "https://www.rappler.com/";
    const sections = []
    let parent = data.section;
    while (parent !== 0) {
      sections.unshift(parent.slug)
      parent = parent.parent
    }
    link = link + sections.join("/")
    return `${link}/${data.slug}`;
  }
  return (
    <a href={url()} target="blank" className="text-xl flex flex-col 
    items-center text-white absolute bottom-5 font-semibold z-50">
      <span className="text-3xl animate-bounce">‸</span>
      <span>Link</span>
    </a>
  )
}

function Story({ data, currentStory }) {
  function optimizeImage() {
    return data.image[3].url;
  }
  const bg = optimizeImage();
  if (currentStory === data.index) {
    return (
      <div className={`flex flex-col h-screen w-full 
                  max-w-md shadow-lg items-center justify-center
                  bg-${Math.floor((Math.random() * 4) + 1)}`}
      >
        <Title title={data.title} />
        <img src={bg} />
        <RapplerLink data={data} />
      </div>
    )
  }
  return null
}

function Stories({ posts, setShowStories }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  return (
    <div className="flex flex-col justify-center items-center bg-gray-900">
      <LeftRightSections currentStory={currentStoryIndex}
        totalPosts={posts.length}
        setShowStories={setShowStories}
        setCurrentStory={setCurrentStoryIndex} />
      <Header posts={posts} currentStory={currentStoryIndex} setShowStories={setShowStories} />
      {posts.map((post, _) => (
        <Story data={post} key={post.id} currentStory={currentStoryIndex} />
      ))}
    </div>
  )
}

export default function Home() {
  const [showStories, setShowStories] = useState(false);
  const [posts, setPosts] = useState([])

  useEffect(async () => {
    const res = await fetch('https://us-central1-rapplerinternal.cloudfunctions.net/latest-news')
    const data = await res.json()
    data.forEach((element, i) => {
      element.index = i
    });
    setPosts(data)
  }, [])

  const placeholders = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function handleClick() {
    setShowStories(true)
  }

  if (!showStories)
    return (
      <div className="flex flex-col w-full items-center">
        <div className=" flex flex-col w-full max-w-2xl p-3">
          <div className="flex items-center justify-center w-full my-8">
            <div className="rounded-full w-24 border-red-500 border-4 cursor-pointer"
              onClick={handleClick}
            >
              <RapplerAvatar />
            </div>
            <span className="flex flex-col ml-5">
              <h1 className="text-4xl text-gray-800">rappler stories</h1>
              <a href="https://rappler.com" target="blank" className="text-gray-500">rappler.com</a>
            </span>
          </div>
          <hr className=" w-full" />
        </div>
        <div className="grid grid-cols-3 w-full max-w-2xl gap-2">
          {
            placeholders.map(i => (
              <span className="w-full bg-gray-200 animate-pulse h-32 md:h-48" key={i}>
              </span>
            ))
          }

        </div>
      </div>
    )
  return (
    <Stories posts={posts} setShowStories={setShowStories} />
  );
}

