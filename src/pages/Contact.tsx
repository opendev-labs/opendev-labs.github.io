import { Mail, Instagram } from 'lucide-react';

export default function Contact() {
    return (
        <section className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-2xl w-full px-6">
                <h1 className="text-4xl font-bold mb-8 tracking-tight">Contact Us</h1>
                <div className="space-y-6">
                    <div className="p-8 border border-[#333] bg-[#050505] rounded-xl group hover:border-[#555] transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <Mail className="text-white" />
                            <h3 className="font-semibold text-lg">Email Support</h3>
                        </div>
                        <p className="text-[#888] mb-4">For general inquiries and enterprise support.</p>
                        <a href="mailto:opendev.help@gmail.com" className="text-white hover:underline decoration-[#333]">opendev.help@gmail.com</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 border border-[#333] bg-[#050505] rounded-xl group hover:border-[#555] transition-colors">
                            <div className="flex items-center gap-4 mb-4">
                                <Instagram className="text-white" />
                                <h3 className="font-semibold text-lg">Office</h3>
                            </div>
                            <a href="https://instagram.com/opendev.labs" target="_blank" className="text-[#888] hover:text-white transition-colors block">@opendev.labs</a>
                        </div>
                        <div className="p-8 border border-[#333] bg-[#050505] rounded-xl group hover:border-[#555] transition-colors">
                            <div className="flex items-center gap-4 mb-4">
                                <Instagram className="text-white" />
                                <h3 className="font-semibold text-lg">Founder</h3>
                            </div>
                            <a href="https://instagram.com/iamyash.io" target="_blank" className="text-[#888] hover:text-white transition-colors block">@iamyash.io</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
