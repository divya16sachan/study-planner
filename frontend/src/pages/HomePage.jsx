import FlipTimer from "@/components/FlipTimer";
import Pomodoro from "@/components/Pomodoro/Pomodoro";
import TaskTable from "@/components/TaskTable";
import { Table, TableBody, TableHead } from "@/components/ui/table";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Calendar } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Card({ title, image, path }) {
  return (
    <Link to={path} className="flex-1">
      <div className="relative rounded-lg aspect-video overflow-hidden">
        <img src={image} alt="" />
        <div className="absolute  sm:text-xl  inset-0 capitalize cursor-pointer flex items-center justify-center font-bold bg-black/30 hover:bg-black/40 transition-colors text-white">
          {title}
        </div>
      </div>
      <div className="text-muted-foreground text-sm my-1 flex  items-center gap-2">
        <Calendar className="size-4" />
        <p>Lorem, ipsum</p>
      </div>
    </Link>
  );
}

const images = [
  "./cover1.jpg",
  "./cover2.jpg",
  "./cover3.jpg",
  "./cover4.jpg",
  "./cover5.jpg",
  "./cover6.jpg",
  "./cover7.jpg",
  "./cover8.jpg",
  "./cover9.jpg",
  "./cover10.jpg",
];

const data = [
  { title: "Daily", path: "/weekly-task", image: "./cover7.jpg" },
  { title: "Weekly", path: "/weekly-task", image: "./cover8.jpg" },
  { title: "Monthly", path: "/weekly-task", image: "./cover9.jpg" },
];

const randomImage = images[Math.floor(Math.random() * images.length)];

const HomePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="p-4 mt-16 max-w-screen-lg mx-auto w-full">
      <div className="relative mb-16">
        <div className="rounded-lg overflow-hidden h-48">
          <img
            onError={(e) => {
              e.target.src = "./placeholder.svg";
            }}
            className="w-full h-full object-cover"
            src={images[9]}
            alt="Cover Photo"
          />
        </div>
        <div className="size-20 absolute rounded-full overflow-hidden bottom-0 left-4 translate-y-1/2">
          <Avatar className="bg-accent">
            <AvatarImage
              className="w-full h-full object-cover"
              src={authUser.picture}
              alt={authUser.name}
            />
            <AvatarFallback>
              <img src="./avatar.png" alt={"Profile placeholder"} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <div className="my-4">
          <h2 className="font-bold text-xl">Life Planner</h2>
          <p className="border-l-2 text-sm text-muted-foreground pl-2 ">
            All your throughs in one private place.
          </p>
        </div>
        <div className="flex gap-4 scrollbar-hide">
          {data.map(({ title, image, path }, index) => (
            <Card key={index} title={title} path={path} image={image} />
          ))}
        </div>
      </div>
      <div className="flex gap-4 my-4">
        {/* <div className='w-[200px]'><FlipTimer /></div> */}
        <div></div>
      </div>
      <div className="bento-grid">
        <div className="p-0"><Pomodoro /></div>
        <div className="flex items-center justify-center">
          <FlipTimer />
        </div>
        <div>3</div>
      </div>
    </div>
  );
};

export default HomePage;
