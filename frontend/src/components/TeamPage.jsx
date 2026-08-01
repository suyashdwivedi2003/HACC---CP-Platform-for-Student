import React from "react";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const teamMembers = [
  {
    name: "Jayant Rajput",
    role: "Full Stack Developer",
    image: "jayant_photo.png",
    description:
      "Hi, I'm Jayant Rajput, A 4th - year Electronics and Communication Engineering student at NIT Raipur — although after studying DSP(Digital Signal Processing), I had an existential crisis and realized: 'Mera toh iss branch mein kuch nahi hone wala'. 😅So, I switched gears! Now I’m a full stack web developer and a problem- solving enthusiast, building cool stuff on the web and cracking code like it owes me money.",
    socials: {
    linkedin: "https://www.linkedin.com/in/jayant-rajput-b940b4250/",
    github: "https://github.com/Jayant-Rajput",
    instagram: "https://www.instagram.com/jayantrajput1282",
  },
  },
{
  name: "Diptesh Raj",
    role: "Full Stack Developer",
      image: "Diptesh_img.png",
        description: "Hey, I’m Diptesh Raj, final year ECE undergrad at NIT Raipur. I love building things that solve real problems and enjoy the creative process that comes with it. Whether it’s brainstorming with a team or diving into something new, I’m always up for a challenge. Outside of tech, I’m just a curious soul who loves exploring ideas and learning along the way.",
    socials: {
    linkedin: "https://www.linkedin.com/in/diptesh-raj-06bb7824a",
      github: "https://github.com/dipteshrastogi",
        instagram: "https://www.instagram.com/diptesh.raj/",
    },
},
];

export default function TeamPage() {
  return (
    <div className="min-h-screen py-42 px-6">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bgvideo2.mp4" type="video/mp4" />
      </video>


      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-fadeIn opacity-0 animation-delay-300">
        Meet Our Team
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-25">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-xl rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300 "
          >
            <div className="relative">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-74 object-cover"
              />
              {/* Social icons container */}
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500">
                <div className="flex space-x-6 transform translate-x-20 group-hover:translate-x-0 transition-transform duration-500">
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-2xl hover:text-indigo-300"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-2xl hover:text-indigo-300"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-2xl hover:text-indigo-300"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-indigo-600 font-medium">{member.role}</p>
              <p className="mt-4 text-gray-600">{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
