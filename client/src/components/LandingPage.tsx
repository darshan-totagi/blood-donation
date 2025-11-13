// src/components/LandingPage.jsx
import React, { use, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();


  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center text-center px-6"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.shutterstock.com/image-vector/world-donor-day-abstract-wallpaper-600nw-2115749144.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl text-white mt-16">
          <h1 className="text-5xl font-bold mb-6">BloodConnect</h1>
          <p className="text-lg mb-12">
            Donate blood, save lives, and find donors near you quickly.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-red-600 text-white px-10 py-5 rounded-3xl shadow-lg hover:bg-red-700 transition text-lg font-semibold"
            >
              Register as Donor
            </button>
            <button
              onClick={() => navigate("/search")}
              className="border-2 border-white text-white px-10 py-5 rounded-3xl shadow-lg hover:bg-red-500 transition text-lg font-semibold"
            >
              Find Donors
            </button>
          </div>
          <p className="mt-6 text-sm italic">
            “Your one drop can be someone’s lifeline.”
          </p>
        </div>
      </section>

      {/* Section 2 - Why Donate Blood */}
      <section
        id="why-donate"
        className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <h2 className="text-4xl font-bold text-red-600 mb-6">
          Why Donate Blood?
        </h2>
        <p className="text-lg text-zinc-700 max-w-3xl mb-12">
          Every 2 seconds, someone in the world needs blood. Donating blood can
          save up to three lives in a single donation.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {[
            {
              title: "Save Lives",
              img: "https://images.unsplash.com/photo-1584452964155-ef139340f0db?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Easy & Safe",
              img: "https://t3.ftcdn.net/jpg/03/09/20/22/360_F_309202280_CgsWoCAdLBe9INBvdwBKUkpaLEP4XNLa.jpg",
            },
            {
              title: "Be a Hero",
              img: "https://www.shutterstock.com/image-vector/blood-donation-design-template-vector-600nw-452564095.jpg",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-red-50 p-4 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-60 object-cover rounded-xl mb-4 transition-transform duration-500 hover:scale-110"
              />
              <h3 className="text-xl font-semibold text-red-600">
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 - How It Works */}
      <section
        id="how-it-works"
        className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <h2 className="text-4xl font-bold text-red-600 mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl">
          <div className="p-6 bg-white shadow-lg rounded-2xl">
            <h3 className="text-2xl font-semibold mb-3 text-red-500">
              1. Register
            </h3>
            <p>
              Sign up as a donor with your details.“Join our community as a
              donor. It only takes a few minutes, and your small step can save
              many lives.”
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-2xl">
            <h3 className="text-2xl font-semibold mb-3 text-red-500">
              2. Search
            </h3>
            <p>
              Need blood urgently? Quickly search and connect with verified
              donors near your location in just a few clicks.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-2xl">
            <h3 className="text-2xl font-semibold mb-3 text-red-500">
              3. Connect
            </h3>
            <p>
              Save lives with timely help.Reach out to a donor, donate safely,
              and make an impact. Your timely help can give someone a second
              chance at life
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer id="contact" className="bg-red-600 text-white py-8 text-center">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
            <p>Email: support@bloodconnect.org</p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: 123, Red Cross Street, Bengaluru</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
            <div className="flex justify-center gap-4 mt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6 fill-current hover:text-gray-200"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6 fill-current hover:text-gray-200"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.94 13.94 0 011.671 3.149 4.916 4.916 0 003.195 9.723a4.903 4.903 0 01-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084 4.923 4.923 0 004.598 3.417A9.867 9.867 0 010 19.54 13.924 13.924 0 007.548 21c9.142 0 14.307-7.721 13.995-14.646A9.935 9.935 0 0024 4.557z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6 fill-current hover:text-gray-200"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.77.131 4.548.402 3.515 1.435 2.482 2.468 2.211 3.69 2.152 4.972.013 8.332 0 8.741 0 12s.013 3.668.072 4.948c.059 1.282.33 2.504 1.363 3.537s2.255 1.304 3.537 1.363C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.059 2.504-.33 3.537-1.363s1.304-2.255 1.363-3.537C23.987 15.668 24 15.259 24 12s-.013-3.668-.072-4.948c-.059-1.282-.33-2.504-1.363-3.537S18.23.131 16.948.072C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p className="text-sm mt-6">
          © 2025 BloodConnect. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
