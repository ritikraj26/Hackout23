import React from "react";
import freelancer from "../../assets/freelancer2.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";

const stats = [
  { name: "Ongoing Projects", value: "12" },
  { name: "Open Projects", value: "30+" },
  { name: "Completed projects", value: "40" },
];

export const Home = () => {
  const navigate = useNavigate();

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const checkAuth = async () => {
    if (sessionStorage.getItem("githubToken")) {
      const isMetaMaskConnected =
        typeof window.ethereum !== "undefined" &&
        window.ethereum.selectedAddress !== null;

      if (!isMetaMaskConnected) {
        toast("Please connect wallet", {
          icon: "🙋🏻",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return false;
      } else {
        // update session storage username
        const user = JSON.parse(sessionStorage.getItem("cryptoLancerUser"));
        // get address
        const signer = provider.getSigner();
        const sender = await signer.getAddress();

        user.address = sender;
        sessionStorage.setItem("cryptoLancerUser", JSON.stringify(user));
      }

      return true;
    } else {
      toast("Please connect github", {
        icon: "🙋🏻",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return false;
    }
  };

  return (
    <>
      <div className="relative isolate h-screen overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img
          src={freelancer}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"
        />
        <div
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#1e060f] to-[#012434] opacity-20"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#2a0c19] to-[#0c0a3b] opacity-20"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              CryptoLancer
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Revolutionize freelancing with CryptoLancer: Break projects into
              milestones, release crypto payments as you progress. Experience
              the future today.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Say goodbye to traditional payment delays and embrace a seamless,
              milestone-based system that ensures fair compensation and
              motivates freelancers to excel. Join CryptoLancer now and
              revolutionize the way you work and get paid.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              <button
                onClick={() => {
                  if (checkAuth()) {
                    navigate("/post-a-project");
                  }
                }}
                className="hover:bg-white p-1 hover:text-green-400 hover:rounded-lg"
              >
                Post a project <span aria-hidden="true">&rarr;</span>
              </button>
              <button
                onClick={() => {
                  if (checkAuth()) {
                    navigate("/projects");
                  }
                }}
                className="hover:bg-white p-1 hover:text-green-400 hover:rounded-lg"
              >
                Find projects <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="flex flex-col-reverse">
                  <dt className="text-base leading-7 text-gray-300 hover:text-green-400">
                    {stat.name}
                  </dt>
                  <dd className="text-2xl font-bold leading-9 tracking-tight text-white ">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};
