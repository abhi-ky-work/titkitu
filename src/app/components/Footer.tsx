

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="luxury-gradient p-2 rounded-lg">
                    <span className="text-white font-bold">EL</span>
                  </div>
                  <span className="text-xl font-bold">TikiTu</span>
                </div>
                <p className="text-gray-400">Your event booking platform</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Events</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Music</li>
                  <li>Sports</li>
                  <li>Theater</li>
                  <li>Comedy</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Partners</li>
                  <li>Press</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Contact Us</li>
                  <li>Safety</li>
                  <li>Terms</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 TikiTu. All rights reserved.</p>
            </div>
          </div>
        </footer>
    )
}