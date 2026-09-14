import {useState} from "react";
import Footer from "../Components/Layout/Footer";
import Header from "../Components/Layout/Header";

const FAQPage = () => {

    window.scrollTo(0, 0);
    return (
        <div>

            <Header activeHeading={5}/>
            <AboutUs/>
            <Footer/>
        </div>
    );
};

const AboutUs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "What do you mean by 'Figma assets'?",
            answer:
                "You will have access to download the full Figma project including all of the pages, the components, responsive pages, and also the icons, illustrations, and images included in the screens.",
        },
        {
            question: "What does 'lifetime access' exactly mean?",
            answer:
                "Once you have purchased either the design, code, or both packages, you will have access to all of the future updates based on the roadmap, free of charge.",
        },
        {
            question: "How does support work?",
            answer:
                "We're aware of the importance of well qualified support, that is why we decided that support will only be provided by the authors that actually worked on this project.",
            additional: (
                <p className="text-gray-500 dark:text-gray-400">
                    Feel free to{" "}
                    <a href="#"
                       className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline">
                        contact us
                    </a>{" "}
                    and we&#39;ll help you out as soon as we can.
                </p>
            ),
        },
        {
            question: "I want to build more than one project, It's that allowed?",
            answer:
                "You can use Windster for an unlimited amount of projects, whether it's a personal website, a SaaS app, or a website for a client. As long as you don't build a product that will directly compete with Windster either as a UI kit, theme, or template, it's fine.",
            additional: (
                <p className="text-gray-500 dark:text-gray-400">
                    Find out more information by{" "}
                    <a href="#"
                       className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline">
                        reading the license
                    </a>
                    .
                </p>
            ),
        },
        {
            question: "What does 'free updates' include?",
            answer:
                "The free updates that will be provided is based on the roadmap that we have laid out for this project. It is also possible that we will provide extra updates outside of the roadmap as well.",
        },
        {
            question: "What does the free version include?",
            answer:
                "The free version of Windster includes a minimal style guidelines, component variants, and a dashboard page with the mobile version alongside it.",
            additional: (
                <p className="text-gray-500 dark:text-gray-400">
                    You can use this version for any purposes, because it is open-source under the MIT license.
                </p>
            ),
        },
        {
            question: "What is the difference between Windster and Tailwind UI?",
            answer:
                "Although both Windster and Tailwind UI are built for integration with Tailwind CSS, the main difference is in the design, the pages, the extra components and UI elements that Windster includes.",
            additional: (
                <p className="text-gray-500 dark:text-gray-400">
                    Additionally, Windster is a project that is still in development, and later it will include both the
                    application, marketing, and e-commerce UI interfaces.
                </p>
            ),
        },
        {
            question: "Can I use Windster in open-source projects?",
            answer:
                "Generally, it is accepted to use Windster in open-source projects, as long as it is not a UI library, a theme, a template, a page-builder that would be considered as an alternative to Windster itself.",
            additional: (
                <p className="text-gray-500 dark:text-gray-400">
                    With that being said, feel free to use this design kit for your open-source projects. Find out more
                    information by{" "}
                    <a href="#"
                       className="font-medium underline text-primary-600 dark:text-primary-500 hover:no-underline">
                        reading the license
                    </a>
                    .
                </p>
            ),
        },
    ];

    return (
        <div>
            {/* Section 1 */}
            <section className="py-10 relative">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
                        <div
                            className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
                            <div
                                className="pt-10 lg:pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
                                <img
                                    className="rounded-xl object-cover hover:shadow-lg hover:scale-105 transition-all duration-700 ease-in-out"
                                    src="https://pagedone.io/asset/uploads/1717741205.png"
                                    alt="about Us image"
                                />
                            </div>
                            <img
                                className="sm:ml-0 ml-auto rounded-xl object-cover hover:shadow-lg hover:scale-105 transition-all duration-700 ease-in-out"
                                src="https://pagedone.io/asset/uploads/1717741215.png"
                                alt="about Us image"
                            />
                        </div>
                        <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                            <div className="w-full flex-col justify-center items-start gap-8 flex">
                                <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                                    <h2 className="text-gray-900 text-4xl font-bold font-manrope hover:drop-shadow-md leading-normal lg:text-start text-center">
                                        Empowering Each Other to Succeed
                                    </h2>
                                    <p className="text-gray-500 text-base font-normal hover:drop-shadow-md leading-relaxed lg:text-start text-center">
                                        Every project we&#39;ve undertaken has been a collaborative effort, where every
                                        person
                                        involved has left their mark. Together, we&#39;ve not only constructed buildings
                                        but also
                                        built enduring connections that define our success story.
                                    </p>
                                </div>
                                <div
                                    className="w-full lg:justify-start hover:drop-shadow-md justify-center items-center sm:gap-10 gap-5 inline-flex">
                                    <div className="flex-col justify-start items-start inline-flex">
                                        <h3 className="text-gray-900 text-4xl font-bold font-manrope leading-normal">33+</h3>
                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed">Years of
                                            Experience</h6>
                                    </div>
                                    <div className="flex-col justify-start items-start inline-flex">
                                        <h4 className="text-gray-900 text-4xl font-bold font-manrope leading-normal">125+</h4>
                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed">Successful
                                            Projects</h6>
                                    </div>
                                    <div className="flex-col justify-start items-start inline-flex">
                                        <h4 className="text-gray-900 text-4xl font-bold font-manrope leading-normal">52+</h4>
                                        <h6 className="text-gray-500 text-base font-normal leading-relaxed">Happy
                                            Clients</h6>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="sm:w-fit w-full hover:drop-shadow-lg group px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out justify-center items-center flex">
                                <span
                                    className="px-1.5 text-indigo-600 text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">Read More</span>
                                <svg className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out"
                                     xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                     fill="none">
                                    <path d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996" stroke="#4F46E5"
                                          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2 */}
            <section className="py-10 relative xl:mr-0 lg:mr-5 mr-0">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
                        <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                            <div className="w-full flex-col hover:drop-shadow-md justify-center items-start gap-8 flex">
                                <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                                    <div
                                        className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                                        <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                                            The Tale of Our Achievement Story
                                        </h2>
                                        <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                                            Our achievement story is a testament to teamwork and perseverance. Together,
                                            we&#39;ve
                                            overcome challenges, celebrated victories, and created a narrative of
                                            progress and
                                            success.
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full flex-col justify-center items-start gap-6 flex">
                                    <div
                                        className="w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                                        <div
                                            className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                            <h4 className="text-gray-900 text-2xl font-bold font-manrope leading-9">33+
                                                Years</h4>
                                            <p className="text-gray-500 text-base font-normal leading-relaxed">Influencing
                                                Digital
                                                Landscapes Together</p>
                                        </div>
                                        <div
                                            className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                            <h4 className="text-gray-900 text-2xl font-bold font-manrope leading-9">125+
                                                Projects</h4>
                                            <p className="text-gray-500 text-base font-normal leading-relaxed">Excellence
                                                Achieved
                                                Through Success</p>
                                        </div>
                                    </div>
                                    <div
                                        className="w-full h-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                                        <div
                                            className="w-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                            <h4 className="text-gray-900 text-2xl font-bold font-manrope leading-9">26+
                                                Awards</h4>
                                            <p className="text-gray-500 text-base font-normal leading-relaxed">Our
                                                Dedication to
                                                Innovation Wins Understanding</p>
                                        </div>
                                        <div
                                            className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                            <h4 className="text-gray-900 text-2xl font-bold font-manrope leading-9">99%
                                                Happy
                                                Clients</h4>
                                            <p className="text-gray-500 text-base font-normal leading-relaxed">Mirrors
                                                our Focus on
                                                Client Satisfaction.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="sm:w-fit hover:drop-shadow-lg w-full group px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out justify-center items-center flex">
                                <span
                                    className="px-1.5 text-indigo-600 text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">Read More</span>
                                <svg className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out"
                                     xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                     fill="none">
                                    <path d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996" stroke="#4F46E5"
                                          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="w-full lg:justify-start justify-center items-start flex">
                            <div
                                className="sm:w-[564px] hover:shadow-lg hover:scale-105 transition-all duration-700 ease-in-out w-full sm:h-[646px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                                <img className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                                     src="https://pagedone.io/asset/uploads/1717742431.png" alt="about Us image"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section className="py-10  relative">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
                        <div
                            className="sm:w-[504px] hover:shadow-lg hover:scale-105 transition-all duration-700 ease-in-out w-full sm:h-[546px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                            <img className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                                 src="https://pagedone.io/asset/uploads/1717751272.png" alt="about Us image"/>
                        </div>
                        <div
                            className="w-full hover:drop-shadow-md flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                            <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                                <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">Building
                                    Stronger Communities through Collaboration and Empowerment</h2>
                                <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">Through
                                    collaboration, diverse perspectives and strengths are leveraged to create inclusive
                                    environments where everyone has the opportunity to thrive. This approach not only
                                    fosters personal growth and achievement but also strengthens the fabric of
                                    society.</p>
                            </div>
                            <button
                                className="sm:w-fit w-full hover:drop-shadow-lg group px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out justify-center items-center flex">
                                <span
                                    className="px-1.5 text-indigo-600 text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">Read More</span>
                                <svg className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out"
                                     xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                     fill="none">
                                    <path d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996" stroke="#4F46E5"
                                          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="">
                <div className="py-8 px-8 mx-auto rounded-2xl bg-white sm:py-16 lg:px-10">
                    <h2 className="mb-8 text-4xl lg:text-5xl tracking-tight font-extrabold text-black ">Frequently asked
                        questions</h2>
                    <div
                        className="grid pt-8 text-left border-t border-gray-200 md:gap-16 dark:border-gray-700 md:grid-cols-2">
                        {faqData.map((faq, index) => (
                            <div key={index} className="mb-4 lg:mb-[-2em]">
                                <button
                                    className="flex items-center justify-between w-full text-left"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <h3 className="flex items-center mb-4 text-lg font-medium text-gray-700 ">
                                        <svg className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 " fill="currentColor"
                                             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                        {faq.question}
                                    </h3>
                                    <svg
                                        className={`w-6 h-6 transform transition-transform ${
                                            openIndex === index ? "rotate-180" : "rotate-0"
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <div className="mt-2">
                                        <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
                                        {faq.additional && faq.additional}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
