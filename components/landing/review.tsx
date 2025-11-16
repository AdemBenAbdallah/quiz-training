import StarIcon from "@/components/icons/Star";
import Image from "next/image";

export default function Review() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1">
      <section className="mx-auto my-12 max-w-md space-y-4 max-lg:px-4 md:my-24 md:space-y-6 lg:max-w-lg">
        <div className="rating !flex justify-center">
          <StarIcon className="h-6 w-6 text-yellow-500" />
          <StarIcon className="h-6 w-6 text-yellow-500" />
          <StarIcon className="h-6 w-6 text-yellow-500" />
          <StarIcon className="h-6 w-6 text-yellow-500" />
          <StarIcon className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="space-y-2 text-center text-base leading-relaxed lg:text-lg">
          <span className="bg-yellow-100/80 px-1.5 font-medium text-yellow-950 dark:bg-yellow-900/80 dark:text-yellow-100">
            AwsQuizGame is the best way to learn and prepare for the AWS
            Developer exam.
          </span>
          It was the main reason I was able to pass the exam faster and with
          confidence.
        </div>

        <div className="flex items-center justify-center gap-3 lg:gap-4">
          <Image
            alt="Wozu testimonial for DataFast"
            loading="lazy"
            width="48"
            height="48"
            className="h-10 w-10 rounded-full object-cover lg:h-12 lg:w-12"
            src="/adem.webp"
          />
          <div>
            <p className="font-semibold lg:text-lg">Adem</p>
            <a
              href="https://adembenabdallah.com"
              className="text-base-secondary text-sm lg:text-base"
              target="_blank"
              rel="noopener noreferrer"
            >
              adembenabdallah.com
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
