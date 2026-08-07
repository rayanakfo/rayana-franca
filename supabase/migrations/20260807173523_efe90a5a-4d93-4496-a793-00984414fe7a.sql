
CREATE POLICY "Anyone can upload briefing media"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'briefing-media');
