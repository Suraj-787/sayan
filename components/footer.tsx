import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">GovSchemes</h3>
            <p className="text-sm text-gray-500">
              Making government schemes accessible to everyone through AI-powered assistance.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="text-sm text-gray-500 hover:text-gray-900">
                  Schemes
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/schemes?category=education" className="text-sm text-gray-500 hover:text-gray-900">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=health" className="text-sm text-gray-500 hover:text-gray-900">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=agriculture" className="text-sm text-gray-500 hover:text-gray-900">
                  Agriculture
                </Link>
              </li>
              <li>
                <Link href="/schemes?category=finance" className="text-sm text-gray-500 hover:text-gray-900">
                  Finance
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} GovSchemes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

