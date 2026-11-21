export declare class PlanExecutorUI {
    /**
     * Menampilkan tombol kecil hitam-putih monokrom untuk eksekusi plan
     * Sesuai catatan sketsa tangan:
     * "buat plan kalau user dan setuju bisa langsung (nanti ada tombol kecil hitam putih) dipencek"
     */
    static promptPlanApproval(planSummary: string): Promise<boolean>;
}
