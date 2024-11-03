import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Upload, BarChart2, Workflow, ListTodo, Search, ExternalLink, UserCircle, ClipboardList, Send, Loader2, CheckCircle2, FileText, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { procurementItemsData } from "@/data/procurement-items";
import { itemDescriptions } from "@/data/item-descriptions";

export function TraceAiApp() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState([
    { text: "Document received", completed: false },
    { text: "Starting analysis...", completed: false },
    { text: "Checking procurement details", completed: false },
    { text: "Verifying compliance", completed: false },
    { text: "Generating audit report", completed: false }
  ]);
  const [documents, setDocuments] = useState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState("Penunjukan langsung")
  const [currentView, setCurrentView] = useState("main")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Berdasarkan data pengadaan yang disampaikan, ditemukan adanya perbedaan mencolok antara harga penawaran dan harga normal, dengan total kenaikan harga mencapai 52% dibandingkan harga normal. Beberapa item menunjukkan kenaikan harga yang sangat signifikan di atas rata-rata, yang berpotensi menjadi anomali dan memerlukan pemeriksaan lebih lanjut untuk memastikan keakuratan harga dan efisiensi biaya dalam proses pengadaan.

Beberapa barang menunjukkan kenaikan harga yang sangat signifikan dibandingkan dengan harga normalnya, seperti:
• Binder: Kenaikan 900%.
• Post-it Notes: Kenaikan 317,5%.
• Gunting Besar: Kenaikan 525%.
• Kalkulator Kantor: Kenaikan 200%.

Selain itu, terdapat barang-barang dengan kenaikan harga yang lumayan besar juga untuk beberapa item, seperti:
• Kertas HVS A3: Kenaikan 40%.
• Klip Kertas Besar: Kenaikan 66,7%.
• Kertas Gambar: Kenaikan 25%.
• Namun, ada juga banyak barang yang menunjukkan kenaikan harga sangat sedikit atau bahkan tidak ada sama sekali (0-2,5%), yang mencerminkan konsistensi harga dengan nilai normal.

Total harga penawaran yang 52% lebih tinggi dari total harga normal ini menunjukkan adanya markup yang cukup signifikan sehingga disarankan untuk melakukan evaluasi lebih lanjut terhadap penawaran ini. Langkah-langkah seperti klarifikasi dengan vendor, negosiasi ulang, atau mencari pemasok alternatif bisa menjadi solusi untuk menjaga efisiensi anggaran pengadaan.`
    }
  ]);
  const [inputMessage, setInputMessage] = useState("")
  const [procurementItems, setProcurementItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  useEffect(() => {
    if (selectedDocument) {
      setProcurementItems(procurementItemsData);
    }
  }, [selectedDocument]);

  const handleUpload = () => {
    setIsUploading(true);
    setProgress(prev => prev.map(step => ({ ...step, completed: false })));

    // Simulate document upload and sequential processing
    const stepDelay = 1000; // 1 second between each step

    // Update steps one by one
    progress.forEach((step, index) => {
      setTimeout(() => {
        setProgress(prev => 
          prev.map((s, i) => ({
            ...s,
            completed: i <= index
          }))
        );

        // After last step is complete, add new document and reset upload state
        if (index === progress.length - 1) {
          setIsUploading(false);
          
          const deviation = (Math.random() * 30).toFixed(1);
          const getRiskLevel = (dev) => {
            if (dev > 25) return "High";
            if (dev >= 15) return "Medium";
            return "Low";
          };

          const newDocument = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Document_${documents.length + 1}.pdf`,
            uploadDate: new Date().toLocaleString(),
            status: "Completed",
            vendor: ["Acme Corp", "TechSupply Inc.", "Global Goods Ltd."][Math.floor(Math.random() * 3)],
            amount: Math.floor(Math.random() * 100000000) + 1000000,
            deviation: deviation,
            riskLevel: getRiskLevel(parseFloat(deviation))
          };
          setDocuments(prev => [...prev, newDocument]);
        }
      }, stepDelay * (index + 1));
    });
  };

  const handleViewDetails = (document) => {
    setSelectedDocument(document)
    setCurrentView("analysis")
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { role: "user", content: inputMessage }])
      setInputMessage("")
      // Simulate AI response
      setTimeout(() => {
        setMessages(
          prev => [...prev, { role: "assistant", content: "This is a simulated AI response to your query about the document." }]
        )
      }, 1000)
    }
  }

  const getDeviationLevel = (unitPrice, marketPrice) => {
    const deviation = (unitPrice - marketPrice) / marketPrice * 100
    if (deviation <= 2) return { level: "Low", percentage: deviation }
    if (deviation <= 10) return { level: "Medium", percentage: deviation }
    return { level: "High", percentage: deviation }
  }

  const renderMainView = () => (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Procurement Document</h3>
              <div className="flex items-center space-x-2">
                <label htmlFor="workflow-select" className="text-sm font-medium text-gray-700">
                  Workflow:
                </label>
                <Select
                  value={selectedWorkflow}
                  onValueChange={(value) => setSelectedWorkflow(value)}>
                  <SelectTrigger id="workflow-select" className="w-[220px]">
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Penunjukan langsung">Penunjukan langsung</SelectItem>
                    <SelectItem value="Pemilihan langsung">Pemilihan langsung</SelectItem>
                    <SelectItem value="Pengadaan dikecualikan">Pengadaan dikecualikan</SelectItem>
                    <SelectItem value="Tender terbuka">Tender terbuka</SelectItem>
                    <SelectItem value="Tender tertutup">Tender tertutup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Upload your procurement document for auditing. Supported formats: PDF, DOCX, XLS.</p>
            </div>
            <div className="mt-5">
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Deviation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-gray-400" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {doc.status === "Completed" ? (
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      ) : doc.status === "In Progress" ? (
                        <Loader2 className="mr-2 h-4 w-4 text-blue-500 animate-spin" />
                      ) : (
                        <div className="mr-2 h-4 w-4 rounded-full bg-yellow-500" />
                      )}
                      {doc.status}
                    </div>
                  </TableCell>
                  <TableCell>{doc.vendor}</TableCell>
                  <TableCell>Rp. {doc.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          doc.deviation > 25 ? "bg-red-500" :
                          doc.deviation >= 15 ? "bg-yellow-500" : "bg-blue-500"
                        }`} />
                      {doc.deviation > 25 ? "High" :
                       doc.deviation >= 15 ? "Medium" : "Low"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex ${
                      doc.deviation > 25 ? "bg-red-100 text-red-800" :
                      doc.deviation >= 15 ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {doc.deviation}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(doc)}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )

  const renderAnalysisView = () => (
    <main className="flex-1 overflow-hidden p-6 flex flex-col">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentView("main")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Documents
        </Button>
      </div>

      <div className="flex-1 flex space-x-4 min-h-0">
        {/* Item Analysis / PDF Viewer */}
        <div className="w-2/3 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 shrink-0">
              <CardTitle className="text-sm font-medium">
                {showPdfViewer ? "PDF Viewer" : "Item Analysis"}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Label htmlFor="pdf-toggle" className="text-sm text-gray-700">Show PDF</Label>
                <Switch
                  id="pdf-toggle"
                  checked={showPdfViewer}
                  onCheckedChange={setShowPdfViewer}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {showPdfViewer ? (
                <div className="h-full bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">PDF Viewer placeholder for {selectedDocument?.name}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Market Price</TableHead>
                      <TableHead>Dev</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {procurementItems.map((item) => {
                      const { level, percentage } = getDeviationLevel(item.unitPrice, item.marketPrice)
                      return (
                        (<TableRow
                          key={item.id}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => setSelectedItem(item)}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>Rp. {item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell>Rp. {item.totalPrice.toLocaleString()}</TableCell>
                          <TableCell>Rp. {item.marketPrice.toLocaleString()}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      level === "Low" ? "bg-blue-100 text-blue-800" :
                                      level === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                      "bg-red-100 text-red-800"
                                    }`}>
                                    {percentage.toFixed(2)}%
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Deviation: Rp. {(item.unitPrice - item.marketPrice).toLocaleString()}</p>
                                  <a href={item.similarItemLink} className="text-blue-500 hover:underline">View Similar Item</a>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>)
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Interface */}
        <div className="w-1/3 h-full flex">
          <Card className="w-full flex flex-col">
            <CardHeader className="shrink-0 border-b">
              <CardTitle>AI Chat</CardTitle>
            </CardHeader>
            
            {/* Main content wrapper */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Scrollable messages area */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg max-w-[90%] ${
                          message.role === 'user' 
                            ? 'bg-blue-100 text-blue-900' 
                            : 'bg-gray-100 text-gray-900'
                        }`}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed input area */}
              <div className="shrink-0 border-t p-4 bg-white mt-auto">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )

  const renderRightPanel = () => {
    if (currentView === "main") {
      return (
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Risk Level Summary</h3>
            {Object.entries(documents.reduce((acc, doc) => {
              acc[doc.riskLevel] = (acc[doc.riskLevel] || 0) + 1
              return acc
            }, {})).map(([level, count]) => (
              <div key={level} className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      level === "Low" ? "bg-blue-500" :
                      level === "Medium" ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                  {level}
                </span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-sm font-medium text-gray-900">{documents.length}</span>
            </div>
          </div>
          <Separator className="my-4" />
          {progress.length > 0 && (
            <div className="space-y-4">
              {progress.map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isUploading && progress.findIndex(s => !s.completed) === index ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                  )}
                  <span className={`text-sm ${step.completed ? 'text-green-700' : 'text-gray-600'}`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Item Details</h3>
          {selectedItem ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Item Name:</p>
                <p className="text-lg font-semibold">{selectedItem.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Description:</p>
                <p className="text-sm text-gray-600">{itemDescriptions[selectedItem.name]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Quantity:</p>
                <p className="text-lg font-semibold">{selectedItem.quantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Unit Price:</p>
                <p className="text-lg font-semibold">Rp. {selectedItem.unitPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Market Price:</p>
                <p className="text-lg font-semibold">Rp. {selectedItem.marketPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Deviation:</p>
                <p className="text-lg font-semibold">
                  {getDeviationLevel(selectedItem.unitPrice, selectedItem.marketPrice).percentage.toFixed(2)}%
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Similar items found in market:</p>
                <div className="space-y-2">
                  {[
                    {
                      name: selectedItem.name,
                      price: selectedItem.marketPrice * 0.95,
                      vendor: "Sinar Abadi",
                      source: "PaDi UMKM",
                      link: selectedItem.similarItemLink
                    },
                    {
                      name: selectedItem.name,
                      price: selectedItem.marketPrice,
                      vendor: "Kopkar BRI",
                      source: "e-Katalog",
                      link: selectedItem.similarItemLink
                    },
                    {
                      name: selectedItem.name,
                      price: selectedItem.marketPrice * 1.05,
                      vendor: "CV Maju Mundur",
                      source: "PaDi UMKM",
                      link: selectedItem.similarItemLink
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => window.open(item.link, '_blank')}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <span className="font-medium text-sm">{item.vendor}</span>
                          <span className="text-xs text-gray-500 ml-2">• {item.source}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-sm text-gray-600">
                        Price: <span className="font-semibold text-blue-600">
                          Rp. {item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select an item from the Item Analysis table to view details.</p>
          )}
        </div>
      );
    }
  }

  return (
    (<div className="flex h-screen overflow-hidden bg-gray-100">
      <header
        className="fixed top-0 left-0 right-0 bg-white shadow z-20 flex items-center justify-between">
        <div className="py-4 px-4 sm:px-6 lg:px-8 flex items-center">
          <Search className="h-8 w-8 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">trace.ai</h1>
        </div>
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <UserCircle className="h-8 w-8 text-gray-500" />
        </div>
      </header>
      {/* Left Sidebar - Admin Dashboard */}
      <div className="fixed left-0 top-0 bottom-0 z-10 w-64 bg-white shadow-md">
        <nav className="mt-20">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-200">
            <BarChart2 className="w-5 h-5 mr-2" />
            Analysis
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <Workflow className="w-5 h-5 mr-2" />
            Workflow
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
            <ListTodo className="w-5 h-5 mr-2" />
            Tasks
          </a>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col mt-16 ml-64">
        {currentView === "main" ? renderMainView() : renderAnalysisView()}
      </div>
      {/* Right Sidebar - Chat/Progress or Item Details */}
      <div className="w-80 bg-white shadow-md flex flex-col mt-16">
        <div className="p-4 border-b shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
            {currentView === "main" ? "Audit Progress" : "Item Details"}
          </h2>
        </div>
        <div className="flex-1 overflow-auto">
          {renderRightPanel()}
        </div>
      </div>
    </div>)
  );
}
