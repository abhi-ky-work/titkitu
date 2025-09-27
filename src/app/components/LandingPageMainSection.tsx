
import { Button } from '@/components/ui/button'
import bgImg from '../../../public/tikitu-stage-dance.jpeg'
import { ArrowRight } from 'lucide-react'
export default function LandingPageMainSection(){
    return (
        <section className="relative h-screen flex items-center justify-center  overflow-hidden ">
            <div  className="absolute inset-0 ">
                <div 
                className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
                style={{
                    backgroundImage: "url('/tikitu-stage-dance.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  
                    // filter: 'brightness(0.7)',
                }}
                >
                </div>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className='relative flex flex-col items-center justify-center text-center px-4'>
                <h1 className='font-bold text-white text-5xl mb-6 md:text-7xl'>
                    Make Your Day
                    <span className='block text-[rgb(245,158,7)]'>Unforgettable</span>
                </h1>
                <p className='text-white text-lg mb-8 md:text-2xl mt-4 max-w-2xl'
                >Premium event experiences without any hassle. Discover, book, and enjoy the best events in your city.</p>

                <Button variant="outline" className='bg-white text-lg text-purple-900 hover:bg-pink-100'>
                    Explore Events  
                    <ArrowRight className='ml-2' />
                </Button>
            </div>
        </section>
    )
}