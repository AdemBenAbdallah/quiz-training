import Container from "@/components/ui/container";

export default function CertificateLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-black to-black text-white">
      <Container>
        <div className="flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
          <div className="w-16 h-16 border-4 border-t-white/20 border-solid rounded-full animate-spin" />
          <h2 className="text-2xl font-bold">Loading quiz...</h2>
          <p className="text-gray-400">Please wait while we prepare your questions</p>
        </div>
      </Container>
    </div>
  );
}
