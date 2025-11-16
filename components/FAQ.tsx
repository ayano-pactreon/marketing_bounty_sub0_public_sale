'use client'
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { ChevronDown, FileText, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface FAQRef {
  openTermsModal: () => void;
}

const FAQ = forwardRef<FAQRef>((props, ref) => {
  const [openIndex, setOpenIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const tFaq = useTranslations('faq');

  useImperativeHandle(ref, () => ({
    openTermsModal: () => setOpen(true)
  }));

  const faqs = [
    {
      question: tFaq('items.0.question'),
      answer: tFaq('items.0.answer')
    },
    {
      question: tFaq('items.1.question'),
      answer: tFaq('items.1.answer')
    },
    {
      question: tFaq('items.2.question'),
      answer: tFaq('items.2.answer')
    },
    {
      question: tFaq('items.3.question'),
      answer: tFaq('items.3.answer')
    },
    {
      question: tFaq('items.4.question'),
      answer: tFaq('items.4.answer')
    }
  ];


  return (
      <section id="faq" className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">{tFaq('frequentlyAsked')}</span>
              <br />
              <span className="bg-gradient-to-r from-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
              {tFaq('questions')}
            </span>
            </h2>
            <p className="text-xl text-gray-300">
              {tFaq('description')}
            </p>
          </div>

          <div className="space-y-4 mb-16">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay={100 + (index * 100)}
                >
                  <button
                      onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                      className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-800/80 transition-colors duration-200"
                  >
                    <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                    <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            openIndex === index ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {openIndex === index && (
                      <div className="px-6 pb-6">
                        <div className="h-px bg-gray-700 mb-4"></div>
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                  )}
                </div>
            ))}
          </div>

          {/* Legal Documentation */}
          <div className="text-center" data-aos="fade-up" data-aos-delay="600">
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500/30 hover:bg-gray-800/80 transition-all duration-200 group"
            >
              <FileText className="w-5 h-5 text-purple-400 mr-3" />
              <span className="text-white font-medium group-hover:text-purple-400 transition-colors">
          {tFaq("tokenSaleTerms")}
        </span>
            </button>
            <p className="text-gray-400 text-sm mt-4 max-w-2xl mx-auto">
              {tFaq('reviewTermsNote')}
            </p>
          </div>
        </div>
        {open && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300"
                onClick={() => setOpen(false)}
              />
              
              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
                <div 
                  className="relative bg-gray-800 text-white rounded-2xl shadow-2xl w-[90%] max-w-5xl h-[80%] flex flex-col transform transition-all duration-300 scale-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#c084fc] to-[#a855f7] bg-clip-text text-transparent">
                      {tFaq('modal.title')}
                    </h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body (scrollable) section */}
                  <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-6 text-gray-300">
                      <div className="space-y-4">
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: tFaq('terms.introduction.paragraph1') }} />
                        <p className="text-sm leading-relaxed">
                          {tFaq('terms.introduction.paragraph2')}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.acceptance.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.acceptance.paragraphs.0')}</p>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.acceptance.paragraphs.1')}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.eligibility.title')}</h3>
                        <p className="text-sm leading-relaxed font-semibold text-yellow-400">
                          {tFaq('terms.sections.eligibility.warning')}
                        </p>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.eligibility.paragraphs.0')}</p>

                        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside ml-4 text-gray-300">
                          <li>{tFaq('terms.sections.eligibility.requirements.0')}</li>
                          <li>{tFaq('terms.sections.eligibility.requirements.1')}</li>
                          <li>{tFaq('terms.sections.eligibility.requirements.2')}</li>
                          <li>{tFaq('terms.sections.eligibility.requirements.3')}</li>
                        </ul>

                        <p className="text-sm leading-relaxed">
                          {tFaq('terms.sections.eligibility.disclaimer')}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.registration.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.registration.paragraph')}</p>
                        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside ml-4 text-gray-300">
                          <li>{tFaq('terms.sections.registration.requirements.0')}</li>
                          <li>{tFaq('terms.sections.registration.requirements.1')}</li>
                          <li>{tFaq('terms.sections.registration.requirements.2')}</li>
                          <li>{tFaq('terms.sections.registration.requirements.3')}</li>
                        </ul>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.registration.responsibility')}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.serviceUse.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.serviceUse.paragraph')}</p>
                        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside ml-4 text-gray-300">
                          <li>{tFaq('terms.sections.serviceUse.prohibitions.0')}</li>
                          <li>{tFaq('terms.sections.serviceUse.prohibitions.1')}</li>
                          <li>{tFaq('terms.sections.serviceUse.prohibitions.2')}</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.tokenPurpose.title')}</h3>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: tFaq('terms.sections.tokenPurpose.paragraph') }} />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.riskDisclosure.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.riskDisclosure.paragraph')}</p>
                        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside ml-4 text-gray-300">
                          <li dangerouslySetInnerHTML={{ __html: tFaq('terms.sections.riskDisclosure.risks.0') }} />
                          <li dangerouslySetInnerHTML={{ __html: tFaq('terms.sections.riskDisclosure.risks.1') }} />
                          <li dangerouslySetInnerHTML={{ __html: tFaq('terms.sections.riskDisclosure.risks.2') }} />
                          <li dangerouslySetInnerHTML={{ __html: tFaq('terms.sections.riskDisclosure.risks.3') }} />
                        </ul>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.riskDisclosure.conclusion')}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.payments.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.payments.paragraph')}</p>
                        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside ml-4 text-gray-300">
                          <li>{tFaq('terms.sections.payments.conditions.0')}</li>
                          <li>{tFaq('terms.sections.payments.conditions.1')}</li>
                          <li>{tFaq('terms.sections.payments.conditions.2')}</li>
                          <li>{tFaq('terms.sections.payments.conditions.3')}</li>
                        </ul>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.payments.disclaimer')}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.privacy.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.privacy.paragraph')}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.intellectualProperty.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.intellectualProperty.paragraph')}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.liability.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.liability.paragraph')}</p>
                        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside ml-4 text-gray-300">
                          <li>{tFaq('terms.sections.liability.exclusions.0')}</li>
                          <li>{tFaq('terms.sections.liability.exclusions.1')}</li>
                          <li>{tFaq('terms.sections.liability.exclusions.2')}</li>
                        </ul>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.liability.limitation')}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.indemnification.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.indemnification.paragraph')}</p>
                        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside ml-4 text-gray-300">
                          <li>{tFaq('terms.sections.indemnification.conditions.0')}</li>
                          <li>{tFaq('terms.sections.indemnification.conditions.1')}</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.tokenDelivery.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.tokenDelivery.paragraph')}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-400">{tFaq('terms.sections.termination.title')}</h3>
                        <p className="text-sm leading-relaxed">{tFaq('terms.sections.termination.paragraph')}</p>
                      </div>

                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-700 flex justify-end">
                    <button
                        onClick={() => setOpen(false)}
                        className="bg-gradient-to-r from-[#6d28d9] to-[#c084fc] hover:shadow-2xl hover:shadow-purple-500/25 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      {tFaq('modal.close')}
                    </button>
                  </div>
                </div>
              </div>
            </>
        )}
      </section>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;
