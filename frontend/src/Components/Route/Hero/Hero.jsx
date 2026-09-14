import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {server, backend_url} from "../../../server.jsx";

const DEFAULT_SLIDES = [
    {
        mediaUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80",
        mediaType: "image",
        tag: "New Collection",
        heading: "Discover Artisan\nCraftsmanship",
        subHeading: "Handmade with love — every piece tells a story.",
        ctaText: "Shop Now",
        ctaLink: "/products",
        align: "left",
    },
    {
        mediaUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&auto=format&fit=crop&q=80",
        mediaType: "image",
        tag: "Best Sellers",
        heading: "Timeless Pieces,\nModern Living",
        subHeading: "Curated collections crafted by master artisans.",
        ctaText: "Explore Now",
        ctaLink: "/best-selling",
        align: "center",
    },
    {
        mediaUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80",
        mediaType: "image",
        tag: "Exclusive Deals",
        heading: "Quality Without\nCompromise",
        subHeading: "Shop directly from skilled creators at fair prices.",
        ctaText: "View Deals",
        ctaLink: "/products",
        align: "left",
    },
];

const Hero = () => {
    const [slides, setSlides] = useState([]);
    const [active, setActive] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const progressRef = useRef(null);
    const currentVideoRef = useRef(null);
    const SLIDE_DURATION = 5000;

    const fetchSlides = async () => {
        try {
            const {data} = await axios.get(`${server}/hero-slide/get-all-slides`);
            if (data.slides && data.slides.length > 0) {
                setSlides(data.slides);
            } else {
                setSlides(DEFAULT_SLIDES);
            }
        } catch {
            setSlides(DEFAULT_SLIDES);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const startProgress = (customDuration = SLIDE_DURATION) => {
        setProgress(0);
        clearInterval(progressRef.current);
        const step = 100 / (customDuration / 50);
        progressRef.current = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { clearInterval(progressRef.current); return 100; }
                return p + step;
            });
        }, 50);
    };

    const goToSlide = (idx) => {
        if (animating || idx === active) return;
        setAnimating(true);
        
        // Pause current video if any
        if (currentVideoRef.current) {
            currentVideoRef.current.pause();
            currentVideoRef.current.currentTime = 0;
        }

        setTimeout(() => {
            setActive(idx);
            setAnimating(false);
        }, 350);
    };

    const handleNextSlide = () => {
        goToSlide((active + 1) % slides.length);
    };

    useEffect(() => {
        if (slides.length === 0) return;
        clearInterval(intervalRef.current);
        clearInterval(progressRef.current);

        const currentSlide = slides[active];

        if (currentSlide.mediaType === "video") {
            // Video Slide: Autoplay and transit ONLY when video ends
            const video = currentVideoRef.current;
            if (video) {
                video.currentTime = 0;
                video.play().catch(() => {
                    // Fallback to standard timer if browser blocks autoplay
                    startProgress(SLIDE_DURATION);
                    intervalRef.current = setInterval(handleNextSlide, SLIDE_DURATION);
                });

                // Update progress bar based on video playback position
                const onTimeUpdate = () => {
                    if (video.duration) {
                        setProgress((video.currentTime / video.duration) * 100);
                    }
                };

                const onEnded = () => {
                    handleNextSlide();
                };

                video.addEventListener("timeupdate", onTimeUpdate);
                video.addEventListener("ended", onEnded);

                return () => {
                    video.removeEventListener("timeupdate", onTimeUpdate);
                    video.removeEventListener("ended", onEnded);
                };
            }
        } else {
            // Image Slide: Use standard duration timer
            startProgress(SLIDE_DURATION);
            intervalRef.current = setInterval(handleNextSlide, SLIDE_DURATION);
        }

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(progressRef.current);
        };
    }, [active, slides]);

    if (slides.length === 0) return <div className="skeleton w-full" style={{height: 600}}/>;

    const slide = slides[active];
    const isCenter = slide.align === "center";

    return (
        <div className="relative w-full overflow-hidden" style={{height: 'clamp(480px, 80vh, 760px)'}}>
            {/* Background Medias */}
            {slides.map((s, i) => {
                const sMediaSrc = s.mediaUrl?.startsWith("http") ? s.mediaUrl : `${backend_url}${s.mediaUrl}`;
                const isActive = i === active;
                return (
                    <div
                        key={i}
                        className="absolute inset-0 transition-opacity duration-700"
                        style={{opacity: isActive ? 1 : 0, zIndex: isActive ? 1 : 0}}
                    >
                        {s.mediaType === "video" ? (
                            <video
                                ref={isActive ? currentVideoRef : null}
                                src={sMediaSrc}
                                className="w-full h-full object-cover"
                                style={{transform: isActive ? 'scale(1.02)' : 'scale(1)', transition: 'transform 6s ease-out'}}
                                muted
                                playsInline
                            />
                        ) : (
                            <img
                                src={sMediaSrc}
                                alt={s.heading}
                                className="w-full h-full object-cover"
                                style={{transform: isActive ? 'scale(1.04)' : 'scale(1)', transition: 'transform 6s ease-out'}}
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600"; }}
                            />
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0" style={{
                            background: isCenter
                                ? 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.60) 100%)'
                                : 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 60%, transparent 100%)',
                            zIndex: 2
                        }}/>
                    </div>
                );
            })}

            {/* Content */}
            <div className={`absolute inset-0 flex items-center ${isCenter ? 'justify-center text-center' : 'justify-start text-left'}`} style={{zIndex: 10}}>
                <div className={`px-8 md:px-16 max-w-2xl ${isCenter ? 'mx-auto' : ''}`}
                     style={{opacity: animating ? 0 : 1, transform: animating ? 'translateY(20px)' : 'translateY(0)', transition: 'opacity 0.5s ease, transform 0.5s ease'}}>
                    {/* Tag */}
                    {slide.tag && (
                        <span className="inline-block mb-4 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs font-semibold uppercase tracking-widest"
                              style={{animation: !animating ? 'fadeInUp 0.5s 0.1s ease both' : 'none'}}>
                            {slide.tag}
                        </span>
                    )}

                    {/* Heading */}
                    <h1 className="text-white font-bold mb-4"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                            whiteSpace: 'pre-line',
                            animation: !animating ? 'fadeInUp 0.55s 0.2s ease both' : 'none',
                        }}>
                        {slide.heading}
                    </h1>

                    {/* Sub */}
                    {slide.subHeading && (
                        <p className="text-white/75 mb-8 text-base md:text-lg font-light"
                           style={{animation: !animating ? 'fadeInUp 0.55s 0.32s ease both' : 'none'}}>
                            {slide.subHeading}
                        </p>
                    )}

                    {/* CTA buttons */}
                    <div className={`flex gap-3 flex-wrap ${isCenter ? 'justify-center' : ''}`}
                         style={{animation: !animating ? 'fadeInUp 0.55s 0.44s ease both' : 'none'}}>
                        {slide.ctaText && (
                            <Link to={slide.ctaLink}>
                                <button className="btn-primary ripple-btn" style={{background: 'white', color: '#0a0a0a', borderColor: 'white', minWidth: 140}}>
                                    {slide.ctaText}
                                </button>
                            </Link>
                        )}
                        <Link to="/products">
                            <button className="btn-outline" style={{borderColor: 'rgba(255,255,255,0.6)', color: 'white', minWidth: 140}}>
                                Browse All
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Slide Controls */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-3 px-8" style={{zIndex: 10}}>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            className="relative h-0.5 rounded-full overflow-hidden transition-all duration-300"
                            style={{width: i === active ? 48 : 24, background: 'rgba(255,255,255,0.35)'}}
                            aria-label={`Go to slide ${i + 1}`}
                        >
                            {i === active && (
                                <div className="absolute inset-y-0 left-0 bg-white rounded-full" style={{width: `${progress}%`, transition: slide.mediaType === "video" ? "none" : "width 50ms linear"}}/>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Arrow Nav */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => goToSlide((active - 1 + slides.length) % slides.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hidden md:flex"
                        style={{zIndex: 10}}
                        aria-label="Previous slide"
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button
                        onClick={() => goToSlide((active + 1) % slides.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hidden md:flex"
                        style={{zIndex: 10}}
                        aria-label="Next slide"
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M9 18l6-6-6-6"/></svg>
                    </button>
                </>
            )}
        </div>
    );
};

export default Hero;