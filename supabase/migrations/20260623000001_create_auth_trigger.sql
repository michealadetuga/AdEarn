-- Function to handle copying new auth.users into public.users and processing referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    new_referral_code text;
    referrer_id uuid;
    ref_code_entered text;
BEGIN
    -- 1. Generate a unique 8-character uppercase alphanumeric referral code
    LOOP
        new_referral_code := upper(substring(md5(random()::text) from 1 for 8));
        -- Check if it already exists in public.users to ensure uniqueness
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = new_referral_code) THEN
            EXIT;
        END IF;
    END LOOP;

    -- 2. Extract the referral code entered by the user (if any)
    ref_code_entered := new.raw_user_meta_data->>'referral_code';
    
    IF ref_code_entered IS NOT NULL AND ref_code_entered <> '' THEN
        -- Find the referrer user id
        SELECT id INTO referrer_id FROM public.users WHERE referral_code = ref_code_entered;
        
        -- If a valid referrer is found (and it's not the user referring themselves)
        IF referrer_id IS NOT NULL AND referrer_id <> new.id THEN
            -- Insert the user with referred_by set
            INSERT INTO public.users (
                id,
                full_name,
                email,
                phone,
                referral_code,
                referred_by,
                is_verified,
                is_banned,
                balance_points,
                total_earned,
                total_withdrawn,
                created_at
            ) VALUES (
                new.id,
                COALESCE(new.raw_user_meta_data->>'full_name', ''),
                new.email,
                new.phone,
                new_referral_code,
                referrer_id,
                false,
                false,
                0,
                0,
                0,
                now()
            );

            -- Insert the referral record (bonus_points defaults to 500)
            INSERT INTO public.referrals (
                referrer_id,
                referred_id,
                bonus_points,
                created_at
            ) VALUES (
                referrer_id,
                new.id,
                500,
                now()
            );

            -- Award 500 bonus points to the referrer
            UPDATE public.users 
            SET balance_points = balance_points + 500,
                total_earned = total_earned + 500
            WHERE id = referrer_id;
            
            RETURN new;
        END IF;
    END IF;

    -- Insert user without referred_by
    INSERT INTO public.users (
        id,
        full_name,
        email,
        phone,
        referral_code,
        referred_by,
        is_verified,
        is_banned,
        balance_points,
        total_earned,
        total_withdrawn,
        created_at
    ) VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        new.email,
        new.phone,
        new_referral_code,
        NULL,
        false,
        false,
        0,
        0,
        0,
        now()
    );

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
