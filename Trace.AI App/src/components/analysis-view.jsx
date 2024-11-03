import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Document, Page, pdfjs } from 'react-pdf'
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export function AnalysisView({ selectedDocument, messages, inputMessage, setInputMessage, handleSendMessage, onBack }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [procurementItems, setProcurementItems] = useState([
    { id: "1", name: "Office Chairs", quantity: 50, unitPrice: 100000, totalPrice: 5000000, marketPrice: 98000, similarItemLink: "#" },
    { id: "2", name: "Desks", quantity: 25, unitPrice: 500000, totalPrice: 12500000, marketPrice: 450000, similarItemLink: "#" },
    { id: "3", name: "Laptops", quantity: 10, unitPrice: 10000000, totalPrice: 100000000, marketPrice: 8500000, similarItemLink: "#" },
    { id: "4", name: "Printers", quantity: 5, unitPrice: 2000000, totalPrice: 10000000, marketPrice: 1950000, similarItemLink: "#" },
  ])

  // Create URL for the PDF file when component mounts or document changes
  useEffect(() => {
    if (selectedDocument?.file) {
      const url = URL.createObjectURL(selectedDocument.file)
      setPdfUrl(url)
      
      // Cleanup URL when component unmounts
      return () => URL.revokeObjectURL(url)
    }
  }, [selectedDocument])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error)
  }

  const nextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages))
  }

  const prevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  function getDeviationLevel(unitPrice, marketPrice) {
    const deviation = (unitPrice - marketPrice) / marketPrice * 100
    if (deviation <= 2) return { level: "Low", percentage: deviation }
    if (deviation <= 10) return { level: "Medium", percentage: deviation }
    return { level: "High", percentage: deviation }
  }

  return (
    <main className="flex-1 overflow-hidden p-6 flex flex-col">
      <div className="mb-4">
        <Button variant="ghost" onClick={onBack}>← Back to Home</Button>
      </div>
      <div className="flex-1 flex space-x-4 min-h-0">
        {/* PDF Viewer */}
        <div className="w-1/2 bg-white shadow rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedDocument?.name}
            </h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto min-h-0">
            {pdfUrl ? (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="flex justify-center"
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  className="shadow-lg"
                />
              </Document>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No PDF file loaded</p>
              </div>
            )}
          </div>

          {/* PDF Controls */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="w-1/2 bg-white shadow rounded-lg p-4 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AI Chat</h3>
          <ScrollArea className="flex-1 min-h-0">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow mr-2" />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
