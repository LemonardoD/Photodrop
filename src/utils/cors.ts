export const corsOptions = {
    origin: ["https://www.youtube.com", "http://localhost:3000","https://www.google.com", "https://front-photo-ph.vercel.app", 
    "https://front-photo-lcnyxt7cn-mrslecter.vercel.app", "https://front-photo-ph.vercel.app/login", "front-photo-pjk4h8p0k-mrslecter.vercel.app", ],
    methods: ["PUT","OPTIONS", "GET", "POST", "DELETE"],
    preflightContinue: true,
    credentials: true,
};