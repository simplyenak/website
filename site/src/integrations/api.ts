import { defineRouteHandlers } from 'astro:server';
import type { AstroIntegration } from 'astro';

export default function apiIntegration(): AstroIntegration {
  return {
    name: 'api-integration',
    hooks: {
      'astro:server:setup': defineRouteHandlers([
        {
          method: 'post',
          route: '/api/experience-note',
          handler: async (request, context) => {
            const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'https://cms.system.simplyenak.com';
            const PAYLOAD_TOKEN = import.meta.env.PAYLOAD_TOKEN || '';
            
            if (!PAYLOAD_TOKEN) {
              return context.json({ error: 'Server configuration error' }, 500);
            }
            
            try {
              const data = await request.json();
              
              // Prepare the note
              const note = {
                title: data.title || 'Untitled Experience',
                location: data.location || '',
                noteType: data.noteType || 'tour_debrief',
                dishes: data.dishes || [],
                vendors: data.vendors || [],
                sensoryDetails: data.sensoryDetails || [],
                surprises: data.surprises || '',
                recommendations: data.recommendations || [],
                bestTime: data.bestTime || '',
                priceRange: data.priceRange || '',
                rawNote: data.rawNote || '',
                submittedBy: data.guideName || 'Anonymous',
                submittedEmail: data.email || '',
                status: 'draft',
              };
              
              // Generate slug
              note.slug = note.title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
              
              // Submit to Payload
              const res = await fetch(`${PAYLOAD_URL}/api/experience_notes`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${PAYLOAD_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: note }),
              });
              
              if (!res.ok) {
                const error = await res.text();
                return context.json({ error: 'Failed to save to CMS', details: error }, 500);
              }
              
              const result = await res.json();
              
              return context.json({
                success: true,
                id: result.doc?.id,
                slug: result.doc?.slug,
                message: 'Experience note saved successfully',
              });
            } catch (err) {
              return context.json({ error: 'Internal server error', details: String(err) }, 500);
            }
          },
        },
      ]),
    },
  };
}
