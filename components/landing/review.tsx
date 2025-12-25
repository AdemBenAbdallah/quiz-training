"use client";

import StarIcon from "@/components/icons/Star";
import Image from "next/image";

const testimonials = [
  {
    name: "Adem Ben Abdallah - Founder",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocK-99BC_fCl-eD5EJYxaBNYoj2s3sQz2NB7uI0LO-kB5rm8TWcb=s96-c",
    text: "I built CertQuickly to help me pass my AWS Developer exam—and it worked. Now it helps thousands of developers do the same.",
    highlight: "it worked",
    website: "adembenabdallah.com",
  },
  {
    name: "Kunal Rai",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocJCQiHbhaRzNHvzkHEVXsDhakSj2_732PXAgTbK0L8YYek34g=s96-c",
    text: "The practice questions are incredibly realistic and explanations helped me understand complex AWS concepts. Highly recommended for anyone serious about certification.",
    highlight: "incredibly realistic",
    website: "",
  },
  {
    name: "Arpit Pandey",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocIeZCwnrHlSsK51ZbIyBNxNIobMbgSBK5MY8tp-Kpda7JoGXEY7=s96-c",
    text: "I was skeptical at first, but CertQuickly exceeded all my expectations. The structured approach to learning AWS services made all the difference.",
    highlight: "exceeded all my expectations",
    website: "",
  },
  {
    name: "Nanda Kishore",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocIPyLqHvzGBbF6iz39kHC5R61REQ8LjrzAyy5fvIIVQKKJOOQ=s96-c",
    text: "Passed my AWS Solutions Architect exam on the first try! The detailed explanations and progress tracking kept me motivated throughout my preparation journey.",
    highlight: "on the first try",
    website: "",
  },
  {
    name: "Sivanraja Velmurugan",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocJgAq9miWi3DX3aoH1sWYVA24IEfYdp0hlsxcbWvFlc9CA_1Jo=s96-c",
    text: "The best investment I made for my career. CertQuickly helped me prepare efficiently and pass my certification in just 2 weeks instead of months.",
    highlight: "in just 2 weeks instead of months",
    website: "",
  },
  {
    name: "Emanuelly",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocK5eA69vxWeDKThZkZUL6rAAxEtSrM-pgcq99iL0lBOW9uwH4nCVg=s96-c",
    text: "Amazing platform! The AI-powered explanations helped me understand even the most difficult AWS concepts. Worth every penny.",
    highlight: "AI-powered explanations",
    website: "",
  },
  {
    name: "Vishwakarma Nitish",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocIA4sxO-a3JK70_4pyXisLeTzYc1HNZol1qKUbGYOsRJI0qew=s96-c",
    text: "CertQuickly transformed how I approach exam preparation. The focused questions and instant feedback accelerated my learning significantly.",
    highlight: "accelerated my learning significantly",
    website: "",
  },
  {
    name: "Siddhant Sharma",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocL6GsVEj1QYCHaTs9ORLn9Rn-jr8-1gWPBD8cAArq7ukdr81Q=s96-c",
    text: "Finally found a platform that delivers on its promises. CertQuickly made AWS certification preparation feel manageable and achievable.",
    highlight: "delivers on its promises",
    website: "",
  },
  {
    name: "Devanshu Dandekar",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocIKGeamKGUfk4oZ7L0fFnA36XOpAHjWH5LrArGAvfsbM5dngQ5p=s96-c",
    text: "The combination of practice questions and AI explanations is unbeatable. I went from confused to confident in record time.",
    highlight: "is unbeatable",
    website: "",
  },
  {
    name: "Surjit Singh",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocLfnhXzk0F7cCQRe8n4-GFZQrA7yQae5mA-Fdefl2It33w6Jg=s96-c",
    text: "CertQuickly saved me weeks of study time. The targeted practice and clear explanations made all complex AWS topics click.",
    highlight: "made all complex AWS topics click",
    website: "",
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span
          key={index}
          className="bg-yellow-100/80 px-1.5 font-medium text-yellow-950 dark:bg-yellow-900/80 dark:text-yellow-100"
        >
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  };

  return (
    <div className="flex-none w-[440px] will-change-transform overflow-hidden">
      <div className="rounded-xl p-6 flex flex-col justify-between h-full backdrop-blur-sm transform translateZ-0">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
            ))}
          </div>
          <p className="text-base leading-relaxed text-center line-clamp-3">
            {highlightText(testimonial.text, testimonial.highlight || "")}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Image
            alt={testimonial.name}
            loading="lazy"
            width="40"
            height="40"
            className="w-10 h-10 rounded-full object-cover"
            src={testimonial.image}
          />
          <div className="transform translateZ-0">
            <p className="font-medium text-white">{testimonial.name}</p>
            {testimonial.website && (
              <a
                href={`https://${testimonial.website}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {testimonial.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Review() {
  const scrollItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden">
          <style jsx>{`
            .scroll-container {
              display: flex;
              gap: 1.5rem;
              animation: scroll 45s linear infinite;
              width: max-content;
            }

            .scroll-container:hover {
              animation-play-state: paused;
            }

            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .scroll-container {
                animation: none;
                overflow-x: auto;
              }

              .scroll-container::-webkit-scrollbar {
                display: none;
              }
            }
          `}</style>

          <div className="scroll-container pb-4">
            {scrollItems.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
