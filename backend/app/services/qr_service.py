import io
import base64
import uuid

def generate_qr_token() -> str:
    return str(uuid.uuid4()).replace("-", "")[:16]

def generate_qr_svg(token: str, base_url: str = "http://localhost:3000/track") -> str:
    """
    Generates a QR code data or SVG string for the given batch token.
    Public verification URL: {base_url}/{token}
    """
    url = f"{base_url}/{token}"
    try:
        import qrcode
        import qrcode.image.svg

        factory = qrcode.image.svg.SvgPathImage
        img = qrcode.make(url, image_factory=factory, box_size=10)
        stream = io.BytesIO()
        img.save(stream)
        svg_content = stream.getvalue().decode("utf-8")
        return svg_content
    except Exception:
        # Fallback SVG representation if qrcode svg module has issues
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f8fafc"/><text x="100" y="100" text-anchor="middle" font-size="12" fill="#0f172a">QR: {token[:8]}</text></svg>'

def generate_qr_data_url(token: str, base_url: str = "http://localhost:3000/track") -> str:
    url = f"{base_url}/{token}"
    try:
        import qrcode
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=8,
            border=2,
        )
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")
        stream = io.BytesIO()
        img.save(stream, format="PNG")
        b64 = base64.b64encode(stream.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{b64}"
    except Exception:
        return ""
