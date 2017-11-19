(function() {
    var Point = Laya.Point;

    Point.p = 
    Point.create = function(x, y) {
        return new Point(x, y);
    };
    
    /**
     * smallest such that 1.0+FLT_EPSILON != 1.0
     * @constant
     * @type Number
     */
    Point.POINT_EPSILON = parseFloat('1.192092896e-07F');
    
    /**
     * Returns opposite of point.
     * @param {Point.Point} point
     * @return {Point.Point}
     */
    Point.pNeg = function (point) {
        return Point.p(-point.x, -point.y);
    };
    
    /**
     * Calculates sum of two points.
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     * @return {Point.Point}
     */
    Point.pAdd = function (v1, v2) {
        return Point.p(v1.x + v2.x, v1.y + v2.y);
    };
    
    /**
     * Calculates difference of two points.
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     * @return {Point.Point}
     */
    Point.pSub = function (v1, v2) {
        return Point.p(v1.x - v2.x, v1.y - v2.y);
    };
    
    /**
     * Returns point multiplied by given factor.
     * @param {Point.Point} point
     * @param {Number} floatVar
     * @return {Point.Point}
     */
    Point.pMult = function (point, floatVar) {
        return Point.p(point.x * floatVar, point.y * floatVar);
    };
    
    /**
     * Calculates midpoint between two points.
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     * @return {Point.pMult}
     */
    Point.pMidpoint = function (v1, v2) {
        return Point.pMult(Point.pAdd(v1, v2), 0.5);
    };
    
    /**
     * Calculates dot product of two points.
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     * @return {Number}
     */
    Point.pDot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    };
    
    /**
     * Calculates cross product of two points.
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     * @return {Number}
     */
    Point.pCross = function (v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    };
    
    /**
     * Calculates perpendicular of v, rotated 90 degrees counter-clockwise -- cross(v, perp(v)) >= 0
     * @param {Point.Point} point
     * @return {Point.Point}
     */
    Point.pPerp = function (point) {
        return Point.p(-point.y, point.x);
    };
    
    /**
     * Calculates perpendicular of v, rotated 90 degrees clockwise -- cross(v, rperp(v)) <= 0
     * @param {Point.Point} point
     * @return {Point.Point}
     */
    Point.pRPerp = function (point) {
        return Point.p(point.y, -point.x);
    };
    
    /**
     * Calculates the projection of v1 over v2.
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     * @return {Point.pMult}
     */
    Point.pProject = function (v1, v2) {
        return Point.pMult(v2, Point.pDot(v1, v2) / Point.pDot(v2, v2));
    };
    
    /**
     * Rotates two points.
     * @param  {Point.Point} v1
     * @param  {Point.Point} v2
     * @return {Point.Point}
     */
    Point.pRotate = function (v1, v2) {
        return Point.p(v1.x * v2.x - v1.y * v2.y, v1.x * v2.y + v1.y * v2.x);
    };
    
    /**
     * Unrotates two points.
     * @param  {Point.Point} v1
     * @param  {Point.Point} v2
     * @return {Point.Point}
     */
    Point.pUnrotate = function (v1, v2) {
        return Point.p(v1.x * v2.x + v1.y * v2.y, v1.y * v2.x - v1.x * v2.y);
    };
    
    /**
     * Calculates the square length of a Point.Point (not calling sqrt() )
     * @param  {Point.Point} v
     *@return {Number}
     */
    Point.pLengthSQ = function (v) {
        return Point.pDot(v, v);
    };
    
    /**
     * Calculates the square distance between two points (not calling sqrt() )
     * @param {Point.Point} point1
     * @param {Point.Point} point2
     * @return {Number}
     */
    Point.pDistanceSQ = function(point1, point2){
        return Point.pLengthSQ(Point.pSub(point1,point2));
    };
    
    /**
     * Calculates distance between point an origin
     * @param  {Point.Point} v
     * @return {Number}
     */
    Point.pLength = function (v) {
        return Math.sqrt(Point.pLengthSQ(v));
    };
    
    /**
     * Calculates the distance between two points
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     * @return {Number}
     */
    Point.pDistance = function (v1, v2) {
        return Point.pLength(Point.pSub(v1, v2));
    };
    
    /**
     * Returns point multiplied to a length of 1.
     * @param {Point.Point} v
     * @return {Point.Point}
     */
    Point.pNormalize = function (v) {
        var n = Point.pLength(v);
        return n === 0 ? Point.p(v) : Point.pMult(v, 1.0 / n);
    };
    
    /**
     * Converts radians to a normalized vector.
     * @param {Number} a
     * @return {Point.Point}
     */
    Point.pForAngle = function (a) {
        return Point.p(Math.cos(a), Math.sin(a));
    };
    
    /**
     * Converts a vector to radians.
     * @param {Point.Point} v
     * @return {Number}
     */
    Point.pToAngle = function (v) {
        return Math.atan2(v.y, v.x);
    };
    
    /**
     * Clamp a value between from and to.
     * @param {Number} value
     * @param {Number} min_inclusive
     * @param {Number} max_inclusive
     * @return {Number}
     */
    Point.clampf = function (value, min_inclusive, max_inclusive) {
        if (min_inclusive > max_inclusive) {
            var temp = min_inclusive;
            min_inclusive = max_inclusive;
            max_inclusive = temp;
        }
        return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
    };
    
    /**
     * Clamp a point between from and to.
     * @param {Point} p
     * @param {Number} min_inclusive
     * @param {Number} max_inclusive
     * @return {Point.Point}
     */
    Point.pClamp = function (p, min_inclusive, max_inclusive) {
        return Point.p(Point.clampf(p.x, min_inclusive.x, max_inclusive.x), Point.clampf(p.y, min_inclusive.y, max_inclusive.y));
    };
    
    /**
     * Quickly convert Point.Size to a Point.Point
     * @param {Point.Size} s
     * @return {Point.Point}
     */
    Point.pFromSize = function (s) {
        return Point.p(s.width, s.height);
    };
    
    /**
     * Run a math operation function on each point component <br />
     * Math.abs, Math.fllor, Math.ceil, Math.round.
     * @param {Point.Point} p
     * @param {Function} opFunc
     * @return {Point.Point}
     * @example
     * //For example: let's try to take the floor of x,y
     * var p = Point.pCompOp(Point.p(10,10),Math.abs);
     */
    Point.pCompOp = function (p, opFunc) {
        return Point.p(opFunc(p.x), opFunc(p.y));
    };
    
    /**
     * Linear Interpolation between two points a and b
     * alpha == 0 ? a
     * alpha == 1 ? b
     * otherwise a value between a..b
     * @param {Point.Point} a
     * @param {Point.Point} b
     * @param {Number} alpha
     * @return {Point.pAdd}
     */
    Point.pLerp = function (a, b, alpha) {
        return Point.pAdd(Point.pMult(a, 1 - alpha), Point.pMult(b, alpha));
    };
    
    /**
     * @param {Point.Point} a
     * @param {Point.Point} b
     * @param {Number} variance
     * @return {Boolean} if points have fuzzy equality which means equal with some degree of variance.
     */
    Point.pFuzzyEqual = function (a, b, variance) {
        if (a.x - variance <= b.x && b.x <= a.x + variance) {
            if (a.y - variance <= b.y && b.y <= a.y + variance)
                return true;
        }
        return false;
    };
    
    /**
     * Multiplies a nd b components, a.x*b.x, a.y*b.y
     * @param {Point.Point} a
     * @param {Point.Point} b
     * @return {Point.Point}
     */
    Point.pCompMult = function (a, b) {
        return Point.p(a.x * b.x, a.y * b.y);
    };
    
    /**
     * @param {Point.Point} a
     * @param {Point.Point} b
     * @return {Number} the signed angle in radians between two vector directions
     */
    Point.pAngleSigned = function (a, b) {
        var a2 = Point.pNormalize(a);
        var b2 = Point.pNormalize(b);
        var angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, Point.pDot(a2, b2));
        if (Math.abs(angle) < Point.POINT_EPSILON)
            return 0.0;
        return angle;
    };
    
    /**
     * @param {Point.Point} a
     * @param {Point.Point} b
     * @return {Number} the angle in radians between two vector directions
     */
    Point.pAngle = function (a, b) {
        var angle = Math.acos(Point.pDot(Point.pNormalize(a), Point.pNormalize(b)));
        if (Math.abs(angle) < Point.POINT_EPSILON) return 0.0;
        return angle;
    };
    
    /**
     * Rotates a point counter clockwise by the angle around a pivot
     * @param {Point.Point} v v is the point to rotate
     * @param {Point.Point} pivot pivot is the pivot, naturally
     * @param {Number} angle angle is the angle of rotation cw in radians
     * @return {Point.Point} the rotated point
     */
    Point.pRotateByAngle = function (v, pivot, angle) {
        var r = Point.pSub(v, pivot);
        var cosa = Math.cos(angle), sina = Math.sin(angle);
        var t = r.x;
        r.x = t * cosa - r.y * sina + pivot.x;
        r.y = t * sina + r.y * cosa + pivot.y;
        return r;
    };
    
    /**
     * A general line-line intersection test
     * indicating successful intersection of a line<br />
     * note that to truly test intersection for segments we have to make<br />
     * sure that s & t lie within [0..1] and for rays, make sure s & t > 0<br />
     * the hit point is        p3 + t * (p4 - p3);<br />
     * the hit point also is    p1 + s * (p2 - p1);
     * @param {Point.Point} A A is the startpoint for the first line P1 = (p1 - p2).
     * @param {Point.Point} B B is the endpoint for the first line P1 = (p1 - p2).
     * @param {Point.Point} C C is the startpoint for the second line P2 = (p3 - p4).
     * @param {Point.Point} D D is the endpoint for the second line P2 = (p3 - p4).
     * @param {Point.Point} retP retP.x is the range for a hitpoint in P1 (pa = p1 + s*(p2 - p1)), <br />
     * retP.y is the range for a hitpoint in P3 (pa = p2 + t*(p4 - p3)).
     * @return {Boolean}
     */
    Point.pLineIntersect = function (A, B, C, D, retP) {
        if ((A.x == B.x && A.y == B.y) || (C.x == D.x && C.y == D.y)) {
            return false;
        }
        var BAx = B.x - A.x;
        var BAy = B.y - A.y;
        var DCx = D.x - C.x;
        var DCy = D.y - C.y;
        var ACx = A.x - C.x;
        var ACy = A.y - C.y;
        
        var denom = DCy * BAx - DCx * BAy;
        
        retP.x = DCx * ACy - DCy * ACx;
        retP.y = BAx * ACy - BAy * ACx;
        
        if (denom == 0) {
            if (retP.x == 0 || retP.y == 0) {
                // Lines incident
                return true;
            }
            // Lines parallel and not incident
            return false;
        }
        
        retP.x = retP.x / denom;
        retP.y = retP.y / denom;
        
        return true;
    };
    
    /**
     * ccpSegmentIntersect return YES if Segment A-B intersects with segment C-D.
     * @param {Point.Point} A
     * @param {Point.Point} B
     * @param {Point.Point} C
     * @param {Point.Point} D
     * @return {Boolean}
     */
    Point.pSegmentIntersect = function (A, B, C, D) {
        var retP = Point.p(0, 0);
        if (Point.pLineIntersect(A, B, C, D, retP))
            if (retP.x >= 0.0 && retP.x <= 1.0 && retP.y >= 0.0 && retP.y <= 1.0)
                return true;
        return false;
    };
    
    /**
     * ccpIntersectPoint return the intersection point of line A-B, C-D
     * @param {Point.Point} A
     * @param {Point.Point} B
     * @param {Point.Point} C
     * @param {Point.Point} D
     * @return {Point.Point}
     */
    Point.pIntersectPoint = function (A, B, C, D) {
        var retP = Point.p(0, 0);
        
        if (Point.pLineIntersect(A, B, C, D, retP)) {
            // Point of intersection
            var P = Point.p(0, 0);
            P.x = A.x + retP.x * (B.x - A.x);
            P.y = A.y + retP.x * (B.y - A.y);
            return P;
        }
        
        return Point.p(0,0);
    };
    
    /**
     * check to see if both points are equal
     * @param {Point.Point} A A ccp a
     * @param {Point.Point} B B ccp b to be compared
     * @return {Boolean} the true if both ccp are same
     */
    Point.pSameAs = function (A, B) {
        if ((A != null) && (B != null)) {
            return (A.x == B.x && A.y == B.y);
        }
        return false;
    };



// High Perfomance In Place Operationrs ---------------------------------------
    
    /**
     * sets the position of the point to 0
     * @param {Point.Point} v
     */
    Point.pZeroIn = function(v) {
        v.x = 0;
        v.y = 0;
    };
    
    /**
     * copies the position of one point to another
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     */
    Point.pIn = function(v1, v2) {
        v1.x = v2.x;
        v1.y = v2.y;
    };
    
    /**
     * multiplies the point with the given factor (inplace)
     * @param {Point.Point} point
     * @param {Number} floatVar
     */
    Point.pMultIn = function(point, floatVar) {
        point.x *= floatVar;
        point.y *= floatVar;
    };
    
    /**
     * subtracts one point from another (inplace)
     * @param {Point.Point} v1
     * @param {Point.Point} v2
     */
    Point.pSubIn = function(v1, v2) {
        v1.x -= v2.x;
        v1.y -= v2.y;
    };
    
    /**
     * adds one point to another (inplace)
     * @param {Point.Point} v1
     * @param {Point.point} v2
     */
    Point.pAddIn = function(v1, v2) {
        v1.x += v2.x;
        v1.y += v2.y;
    };
    
    /**
     * normalizes the point (inplace)
     * @param {Point.Point} v
     */
    Point.pNormalizeIn = function(v) {
        Point.pMultIn(v, 1.0 / Math.sqrt(v.x * v.x + v.y * v.y));
    };
}());

