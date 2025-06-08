import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, AlertTriangle, Trash2, Download, X } from 'lucide-react'; // Import Download and X icon
import jsPDF from 'jspdf'; // Import jsPDF
import '../css/HistoryPage.css'; // Pastikan file CSS ini ada
import LoadingSpinner from '../components/LoadingSpinner';
import { getRecommendation } from '../utils/recommendations'; // Import getRecommendation

const HistoryPage = () => {
    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk mengelola modal konfirmasi hapus
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // State untuk mengelola modal detail
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fungsi untuk mengambil data riwayat dari backend
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        // Jika tidak ada token, pengguna belum login
        if (!token) {
            setError('Anda harus login untuk melihat riwayat.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Jika token ditolak (kadaluwarsa/tidak valid), logout otomatis
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil data riwayat.');
            }
            setHistoryData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    // Panggil fetchHistory saat komponen pertama kali dimuat
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);
    
    // Fungsi untuk membuka modal konfirmasi hapus
    const openDeleteModal = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    // Fungsi untuk menutup modal konfirmasi hapus
    const closeDeleteModal = () => {
        setItemToDelete(null);
        setShowDeleteModal(false);
    };

    // Fungsi untuk menjalankan proses penghapusan
    const handleDelete = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        setError(null); // Bersihkan error sebelumnya
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3001/api/history/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Gagal menghapus riwayat.');
            }
            
            // Perbarui UI secara langsung dengan menghapus item dari state
            setHistoryData(prevData => prevData.filter(item => item.id !== itemToDelete.id));

        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    // Fungsi untuk membuka modal detail
    const openDetailModal = (item) => {
        setSelectedItem(item);
        setShowDetailModal(true);
    };

    // Fungsi untuk menutup modal detail
    const closeDetailModal = () => {
        setSelectedItem(null);
        setShowDetailModal(false);
    };

    // Fungsi untuk mengunduh PDF dari data riwayat
    const downloadPdfFromHistory = async (item) => {
        if (!item) {
            alert("Tidak ada data riwayat untuk diunduh.");
            return;
        }

        const doc = new jsPDF();
        const detectionDateTime = new Date(item.scanned_at);

        const recommendationObj = getRecommendation(item.detection_result);
        
        const recommendationList = recommendationObj && Array.isArray(recommendationObj.actions) 
                                   ? recommendationObj.actions 
                                   : ['Tidak ada rekomendasi penanganan yang tersedia.'];

        const detectedTitle = recommendationObj.title || item.detection_result;
        const detectedDescription = recommendationObj.description || "Tidak ada deskripsi tersedia.";
        const detectedIcon = recommendationObj.icon || ""; 

        // --- Header PDF ---
        doc.setFontSize(22);
        doc.text("Laporan Deteksi Penyakit Daun Jagung", 10, 20); 
        doc.setFontSize(10);
        doc.text("Aplikasi Scanner Daun Jagung - Riwayat", 10, 27); // Diubah untuk riwayat
        doc.setLineWidth(0.5);
        doc.line(10, 30, 200, 30); 

        // --- Informasi Deteksi ---
        doc.setFontSize(12);
        doc.text(`Tanggal Deteksi: ${detectionDateTime.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, 10, 40);
        doc.text(`Waktu Deteksi: ${detectionDateTime.toLocaleTimeString('id-ID')}`, 10, 47);
        // Jika Anda memiliki nama pengguna di riwayat item, tambahkan di sini:
        // doc.text(`Pengguna: ${item.userName || 'Tidak Tersedia'}`, 10, 54); 
        doc.text(`Sumber Gambar: Riwayat Pindai`, 10, 54); // Diubah untuk riwayat

        // --- Gambar yang Dideteksi ---
        const startYImage = 63; // Sesuaikan posisi Y jika menambahkan nama pengguna
        doc.setFontSize(14);
        doc.text("Gambar yang Dideteksi:", 10, startYImage);

        if (item.image_data) {
            const img = new Image();
            img.src = item.image_data;
            img.onload = () => {
                const imgWidth = 80; 
                const imgHeight = (img.height * imgWidth) / img.width; 
                const imgX = 10;
                const imgY = startYImage + 7; 
                doc.addImage(item.image_data, 'JPEG', imgX, imgY, imgWidth, imgHeight);
                
                // --- Hasil Deteksi ---
                let currentY = imgY + imgHeight + 10; 
                doc.setFontSize(14);
                doc.text("Hasil Deteksi:", 10, currentY);
                currentY += 10;
                doc.setFontSize(12);
                doc.text(`Penyakit Teridentifikasi: ${detectedIcon} ${detectedTitle}`, 10, currentY); 
                currentY += 7;
                doc.text(`Deskripsi: ${detectedDescription}`, 10, currentY); 
                currentY += 7;
                doc.text(`Tingkat Keyakinan: ${(item.accuracy * 100).toFixed(2)}%`, 10, currentY);
                currentY += 17; 

                // --- Rekomendasi Penanganan (Daftar Berpoin) ---
                doc.setFontSize(14);
                doc.text("Rekomendasi Penanganan:", 10, currentY);
                currentY += 10; 
                doc.setFontSize(12);

                recommendationList.forEach((action, index) => { // Menggunakan 'action' untuk setiap item di 'actions'
                    const listItemText = `${index + 1}. ${action}`; 
                    const splitText = doc.splitTextToSize(listItemText, 180); 
                    doc.text(splitText, 10, currentY);
                    currentY += (splitText.length * 5) + 3; 
                });

                // --- Disclaimer dan Catatan Kaki ---
                currentY = Math.max(currentY, doc.internal.pageSize.height - 30); 
                const disclaimerText = "Catatan: Hasil deteksi ini dihasilkan oleh model AI dan ditujukan sebagai panduan awal. Untuk diagnosis dan penanganan yang lebih akurat, sangat disarankan untuk berkonsultasi dengan ahli pertanian atau agronomis.";
                const splitDisclaimer = doc.splitTextToSize(disclaimerText, 180);
                doc.setFontSize(8);
                doc.setTextColor(100); 
                doc.text(splitDisclaimer, 10, currentY);

                doc.save(`Laporan_Deteksi_Riwayat_${item.detection_result}_${detectionDateTime.toISOString().slice(0,10)}.pdf`);
            };
            img.onerror = () => {
                alert("Gagal memuat gambar untuk PDF.");
            };
        } else {
            // Fallback jika image_data tidak tersedia (meskipun seharusnya selalu ada)
            let currentY = startYImage + 7;
            doc.setFontSize(14);
            doc.text("Hasil Deteksi:", 10, currentY);
            currentY += 10;
            doc.setFontSize(12);
            doc.text(`Penyakit Teridentifikasi: ${detectedIcon} ${detectedTitle}`, 10, currentY);
            currentY += 7;
            doc.text(`Deskripsi: ${detectedDescription}`, 10, currentY);
            currentY += 7;
            doc.text(`Tingkat Keyakinan: ${(item.accuracy * 100).toFixed(2)}%`, 10, currentY);
            currentY += 17;

            doc.setFontSize(14);
            doc.text("Rekomendasi Penanganan:", 10, currentY);
            currentY += 10;
            doc.setFontSize(12);

            recommendationList.forEach((action, index) => {
                const listItemText = `${index + 1}. ${action}`;
                const splitText = doc.splitTextToSize(listItemText, 180);
                doc.text(splitText, 10, currentY);
                currentY += (splitText.length * 5) + 3; 
            });

            currentY = Math.max(currentY, doc.internal.pageSize.height - 30);
            const disclaimerText = "Catatan: Hasil deteksi ini dihasilkan oleh model AI dan ditujukan sebagai panduan awal. Untuk diagnosis dan penanganan yang lebih akurat, sangat disarankan untuk berkonsultasi dengan ahli pertanian atau agronomis.";
            const splitDisclaimer = doc.splitTextToSize(disclaimerText, 180);
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(splitDisclaimer, 10, currentY);

            doc.save(`Laporan_Deteksi_Riwayat_${item.detection_result}_${detectionDateTime.toISOString().slice(0,10)}.pdf`);
        }
    };


    // Fungsi utilitas untuk format tanggal
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Fungsi utilitas untuk styling status
    const getStatusClass = (result) => {
        if (result === 'Sehat') return 'status-sehat';
        if (result === 'Karat' || result === 'Hawar') return 'status-sedang';
        return 'status-diperlukan';
    };
    
    const getStatusText = (result) => {
        if (result === 'Sehat') return 'Sehat';
        return 'Tindakan Diperlukan';
    };

    if (isLoading) {
        return <LoadingSpinner text="Memuat riwayat Anda..." />;
    }
    
    return (
        <>
            <div className="content-area">
                <h2 className="text-left">Riwayat Pindai</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="card">
                    <div className="table-container">
                        {historyData.length > 0 ? (
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Gambar</th>
                                        <th>Tanggal</th>
                                        <th>Hasil Deteksi</th>
                                        <th>Akurasi</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <img src={item.image_data} alt={item.detection_result} className="history-image" />
                                            </td>
                                            <td>{formatDate(item.scanned_at)}</td>
                                            <td className="font-medium">{item.detection_result}</td>
                                            <td className="font-medium">{(item.accuracy * 100).toFixed(1)}%</td>
                                            <td className="text-center">
                                                <span className={`status-badge ${getStatusClass(item.detection_result)}`}>
                                                    {getStatusText(item.detection_result)}
                                                </span>
                                            </td>
                                            <td className="text-center action-buttons">
                                                <button onClick={() => openDetailModal(item)} className="btn-icon" title="Lihat Detail"><Eye size={18} /></button>
                                                <button onClick={() => downloadPdfFromHistory(item)} className="btn-icon" title="Unduh PDF"><Download size={18} /></button>
                                                <button onClick={() => openDeleteModal(item)} className="btn-icon btn-delete" title="Hapus"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                             <div className="text-center py-12">
                                <p className="text-gray-500">Anda belum memiliki riwayat pemindaian.</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            {showDeleteModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3 className="modal-title">Konfirmasi Hapus</h3>
                        <p className="modal-body">Apakah Anda yakin ingin menghapus riwayat pindai ini secara permanen?</p>
                        <div className="modal-actions">
                            <button onClick={closeDeleteModal} className="btn-secondary" disabled={isDeleting}>Batal</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="btn-danger">
                                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail Penyakit */}
            {showDetailModal && selectedItem && (
                <div className="modal-backdrop">
                    <div className="modal-content large">
                        <button onClick={closeDetailModal} className="close-modal-button" title="Tutup">
                            <X size={24} />
                        </button>
                        <h3 className="modal-title">Detail Hasil Pindai</h3>
                        <div className="modal-body detail-modal-body">
                            <div className="detail-header">
                                <img src={selectedItem.image_data} alt="Hasil Pindai" className="detail-image" />
                                <div className="detail-info">
                                    <p className="detail-date">Tanggal: {formatDate(selectedItem.scanned_at)}</p>
                                    <p className="detail-accuracy">Akurasi: {(selectedItem.accuracy * 100).toFixed(1)}%</p>
                                </div>
                            </div>
                            
                            {/* Dapatkan rekomendasi lengkap */}
                            {(() => {
                                const recommendation = getRecommendation(selectedItem.detection_result);
                                return (
                                    <div className="detail-content">
                                        <h4 className="detail-section-title">Penyakit Teridentifikasi:</h4>
                                        <p className="text-lg font-bold text-gray-800">
                                            {recommendation.icon} {recommendation.title || selectedItem.detection_result}
                                            <span className={`status-badge ml-2 ${getStatusClass(selectedItem.detection_result)}`}>
                                                {getStatusText(selectedItem.detection_result)}
                                            </span>
                                        </p>
                                        <p className="text-gray-700 mt-2">{recommendation.description}</p>

                                        <h4 className="detail-section-title mt-4">Rekomendasi Penanganan:</h4>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            {recommendation.actions.map((action, index) => (
                                                <li key={index}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="modal-actions">
                            <button onClick={closeDetailModal} className="btn-primary">Tutup</button>
                            <button onClick={() => downloadPdfFromHistory(selectedItem)} className="btn-download-detail">
                                <Download size={18} className="inline mr-2" /> Unduh Laporan PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HistoryPage;