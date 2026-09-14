import {useNavigate, Link} from "react-router-dom";

const DropDown = ({categoriesData, setDropDown}) => {
    const navigate = useNavigate();
    const submit = (cat) => {
        navigate(`/products?category=${encodeURIComponent(cat.title)}`);
        setDropDown(false);
    };

    return (
        <div
            className="animate-fade-in-down"
            style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                padding: '8px',
                width: 220,
                maxHeight: 380,
                overflowY: 'auto',
            }}
        >
            {categoriesData?.length > 0 ? (
                <>
                    {categoriesData.map((cat, i) => (
                        <div
                            key={i}
                            onClick={() => submit(cat)}
                            className="group flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-all"
                            style={{color: '#c0c0c0'}}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c0c0c0'; }}
                        >
                            <img
                                src={cat.image_Url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                                alt={cat.title}
                                className="w-8 h-8 rounded object-cover shrink-0"
                                style={{opacity: 0.9}}
                                onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"; }}
                            />
                            <span style={{fontSize: 13, fontWeight: 500}}>{cat.title}</span>
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M9 18l6-6-6-6"/>
                            </svg>
                        </div>
                    ))}
                    <div style={{height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 0'}}/>
                    <Link
                        to="/products"
                        onClick={() => setDropDown(false)}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all"
                        style={{color: '#7c3aed'}}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        View All Products →
                    </Link>
                </>
            ) : (
                <div style={{padding: 16, textAlign: 'center', fontSize: 12, color: '#606060'}}>No categories found</div>
            )}
        </div>
    );
};

export default DropDown;